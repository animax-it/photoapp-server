const express = require('express');
const app = express();
const cors = require('cors');
const csv = require('csv-parser');


const fs = require('fs');
const path = require('path');
const multer = require('multer');


app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });


const upload = multer({ storage });

function getFilesInFolder(folderPath) {
    try {
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg']; 
      const files = fs.readdirSync(folderPath);
      const imageFiles = files.filter((file) => {
        const extension = path.extname(file).toLowerCase();
        return imageExtensions.includes(extension);
      });
      return imageFiles;
    } catch (error) {
      console.error('Error reading images in folder:', error.message);
      return [];
    }
  }
  
  function convertCsvToJson(filePath) {
    const jsonArray = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            console.log(JSON.stringify(data) + "current")
            data.brandName = data['brandName '];
            delete data['brandName ']; // Remove the old key
        
            jsonArray.push(data)})
        .on('end', () => resolve(jsonArray))
        .on('error', (error) => reject(error));
    });
  }

  app.post('/upload', upload.fields([{ name: 'photo' }, { name: 'detections' }]), (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  });

app.get('/images', (req, res) => {
    const folderPath =  'C:/Users/anime/photo-app/server/uploads';
    const imageFiles = getFilesInFolder(folderPath);
    console.log('List of image files:', imageFiles);
    imageFiles.map((imageFile)=> {
        let textFileName = imageFile.split(".")[0]
        console.log(textFileName)
       
    })

  res.send(imageFiles)
});

app.get('/image/detail',(req,res) => {
    const fileName = req.query.fileName
    // console.log(fileName)
    
    const textFolderPath = 'C:/Users/anime/photo-app/server/uploads/';
    convertCsvToJson(textFolderPath+fileName+ ".txt")
    .then((jsonData) => {
    //   console.log(jsonData);
      res.send(jsonData)
    })
    .catch((error) => {
      console.error('Error converting CSV to JSON:', error.message);
    });
    
})




const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

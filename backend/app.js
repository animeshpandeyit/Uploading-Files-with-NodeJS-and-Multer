const express = require("express");
const app = express();
const port = 3000;
const multer = require("multer");
const fs = require("fs");
const xlsx = require("xlsx");

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic GET route
app.get("/", (req, res) => {
  res.send("Welcome to the Simple Node.js API!");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./my-uploads");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // console.log("uniqueSuffix", uniqueSuffix);
    // return cb(null, `${Date.now()}-${file.originalname}`);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload-excel", upload.single("file"), (req, res) => {
  const { name, imagename } = req.body;

  // Validate required fields in the request body
  if (!name || !imagename) {
    return res.status(400).json({ error: "Name and Image Name are required!" });
  }

  const uploadedImage = req.file;
  console.log("uploading image " + uploadedImage);

  if (!uploadedImage) {
    return res.status(400).json({ error: "File is required!" });
  }

  const filePath = uploadedImage.path; //
  console.log("filePath:", filePath);

  // res.status(201).json({
  //   message: "Excel file uploaded successfully!",
  //   fileDetails: uploadedImage,
  //   formData: req.body,
  // });
  try {
    const workbook = xlsx.readFile(filePath); // Read Excel file

    const sheetName = workbook.SheetNames[1]; // Get the first sheet

    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert to JSON

    // Group data by location
    const groupedData = sheetData.reduce((acc, row) => {
      const location =
        row[
          ("HOME PAGE",
          "Bank Name",
          "POC Name",
          "POC Contact Details",
          "POC Email id")
        ]; // Adjust column name
      if (location) {
        if (!acc[location]) {
          acc[location] = [];
        }
        acc[location].push(row);
      }
      return acc;
    }, {});

    res.status(201).json({
      message: "Data grouped by location successfully!",
      data: groupedData, // Parsed data
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process the Excel file." });
  } finally {
    // Optionally, clean up the uploaded file
    fs.unlinkSync(filePath);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import express from "express";
import multer from "multer";
import fs from "fs";
import xlsx from "xlsx";
import mongoose from "mongoose";

export const app = express();
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

  try {
    const workbook = xlsx.readFile(filePath); // Read Excel file
    const groupedData = {}; // To store grouped data from all sheets
    // Loop through all sheet names
    for (const sheetName of workbook.SheetNames) {
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert sheet to JSON
      // Group data by specified columns
      sheetData.forEach((row) => {
        const location = `${row["HOME PAGE"] || ""}_${row["Bank Name"] || ""}_${
          row["POC Name"] || ""
        }_${row["POC Contact Details"] || ""}_${row["POC Email id"] || ""}`;

        // console.log("location" + location);

        if (location.trim()) {
          if (!groupedData[location]) {
            groupedData[location] = [];
          }
          groupedData[location].push({ ...row, sheet: sheetName }); // Include sheet name for clarity
        }
      });
    }
    // --------------------------------------------------------------------------

    // --------------------------------------------------------------------------

    // const workbook = xlsx.readFile(filePath);

    // const groupedData = {}; // To store grouped data from all sheets

    // for (const sheetName of workbook.SheetNames) {
    //   const sheetData = xlsx.utils.sheet_to_json(
    //     workbook.SheetNames[sheetName]
    //   );

    //   sheetData.forEach((row) => {
    //     const values = `${row["HOME PAGE"] || ""}_${row["Bank Name"] || ""}_${
    //       row["POC Name"] || ""
    //     }_${row["POC Contact Details"] || ""}_${row["POC Email id"] || ""}`;

    //     if (values.trim()) {
    //       if (!groupedData[values]) {
    //         groupedData[values] = [];
    //       }
    //       groupedData[values].push({ ...row, sheet: sheetName });
    //     }
    //   });
    // }

    // const workbook = xlsx.readFile(filePath);

    // const groupedData = workbook.SheetNames.reduce((acc, sheetName) => {
    //   const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    //   sheetData.forEach((row) => {
    //     const location = `${row["HOME PAGE"] || ""}_${row["Bank Name"] || ""}_${
    //       row["POC Name"] || ""
    //     }_${row["POC Contact Details"] || ""}_${row["POC Email id"] || ""}`;
    //     if (location.trim()) {
    //       if (!acc[location]) {
    //         acc[location] = [];
    //       }
    //       acc[location].push({ ...row, sheet: sheetName });
    //     }
    //   });
    //   return acc;
    // }, {});

    // Respond with the grouped data
    res.status(201).json({
      message: "Data grouped by location successfully for all sheets!",
      data: groupedData,
      metadata: req.body,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process the Excel file." });
  } finally {
    // Optionally, clean up the uploaded file
    fs.unlinkSync(filePath);
  }
});

mongoose
  .connect(
    "mongodb+srv://animeshpandeyit:Animesh123@uploading-file.7zrbd.mongodb.net/"
  )
  .then(() => console.log("Connected!"))
  .catch((err) => console.error("Connection error:", err));

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

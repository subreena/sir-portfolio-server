const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const Student = require("./model/student_model");


const app = express();
const port = 3000; 

app.use(express.json());
app.use(cors(corsConfig));
app.use(express.static("public"));
app.use("/files", express.static("files"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("HELLO FROM SERVER!");
});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific student by ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new student
app.post("/api/students", upload.single("work"), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    const { name, roll, thesis_or_project, thesis_project, university, workLink } = req.body;
    const work = req.file;

    const student = await Student.create({
      name,
      roll,
      thesis_or_project: thesis_or_project === "true",
      thesis_project,
      university,
      workLink,
      work: work ? work.filename : null,
    });

    res.status(200).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: error.message });
  }
});


// Update a student by ID
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a student by ID
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// MongoDB connection
mongoose
  .connect("mongodb+srv://subreena20:abc1abc@server1.4whvdhn.mongodb.net/?retryWrites=true&w=majority&appName=server1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB");
    console.error(error);
  });

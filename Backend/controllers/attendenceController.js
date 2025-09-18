const Attendance = require("../Model/attendenceModal");

exports.getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAttendanceById = async (req, res) => {
  try {
    const data = await Attendance.getById(req.params.id);
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const id = await Attendance.create(req.body);
    res.status(201).json({ message: "Attendance created", Attendance_Id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    await Attendance.update(req.params.id, req.body);
    res.json({ message: "Attendance updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.delete(req.params.id);
    res.json({ message: "Attendance deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const db = require("../config/db");

class Attendance {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM Attendance");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM Attendance WHERE Attendance_Id = ?", [id]);
    return rows[0];
  }

  static async create(data) {
    const { Employee_Id, Date, Check_In_Time, Check_Out_Time, Status, Image_URL } = data;
    const [result] = await db.query(
      "INSERT INTO Attendance (Employee_Id, Date, Check_In_Time, Check_Out_Time, Status, Image_URL) VALUES (?, ?, ?, ?, ?, ?)",
      [Employee_Id, Date, Check_In_Time, Check_Out_Time, Status, Image_URL]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { Employee_Id, Date, Check_In_Time, Check_Out_Time, Status, Image_URL } = data;
    await db.query(
      "UPDATE Attendance SET Employee_Id=?, Date=?, Check_In_Time=?, Check_Out_Time=?, Status=?, Image_URL=? WHERE Attendance_Id=?",
      [Employee_Id, Date, Check_In_Time, Check_Out_Time, Status, Image_URL, id]
    );
  }

  static async delete(id) {
    await db.query("DELETE FROM Attendance WHERE Attendance_Id=?", [id]);
  }
}

module.exports = Attendance;

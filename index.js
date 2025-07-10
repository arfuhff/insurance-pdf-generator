const express = require("express");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/form">
      <label>How many vehicles? </label>
      <input type="number" name="vehicleCount" min="1" required />
      <button type="submit">Next</button>
    </form>
  `);
});

app.post("/form", (req, res) => {
  const vehicleCount = parseInt(req.body.vehicleCount);
  res.render("form", { count: vehicleCount });
});

app.post("/generate", (req, res) => {
  const { name, date, vehicles,heading } = req.body;

  const doc = new PDFDocument();
  res.setHeader("Content-disposition", "inline; filename=insurance-bill.pdf");
  res.setHeader("Content-type", "application/pdf");
  doc.pipe(res);

  doc.fontSize(16).text("STAR INSURANCE", { align: "center", underline: true });
  doc.fontSize(12).text("MANAKALAPADY, KONATHKUNNU", { align: "center" });
  doc.text("Email: lathambikanvb@gmail.com | Phone: +91 7034164276", { align: "center" });
  doc.moveDown();
  doc.text(`DATE: ${date}`,{ align:"right"});
  doc.moveDown();
  doc.font("Helvetica-Bold").text(`${name}`);
  doc.moveDown();

 const headingText = heading === "bill" ? "RECEIPT" : "INSURANCE RENEWAL QUOTATION";
doc.font("Helvetica-Bold").text(headingText, { align: "center" });

  doc.moveDown();

  const tableTop = doc.y;
  const headers = ["Reg No", "Seat Cap", "Insurance", "Premium", "Discount", "Payable"];
  const colWidths = [80, 60, 80, 80, 80, 80];

  headers.forEach((header, i) => {
    doc.text(header, 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop);
  });

  let total = 0;
  vehicles.forEach((v, i) => {
    const y = tableTop + 25 + i * 20;
    doc.text(v.reg, 50, y);
    doc.text(v.seat, 130, y);
    doc.text(v.ins, 190, y);
    doc.text(`Rs.${v.premium}`, 270, y);
    doc.text(`Rs.${v.discount}`, 350, y);
    doc.text(`Rs.${v.payable}`, 430, y);
    total += parseFloat(v.payable);
  });

  doc.moveDown();
  doc.text(`TOTAL PAYABLE: Rs.${total}`, { align: "right" });
 

  doc.end();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



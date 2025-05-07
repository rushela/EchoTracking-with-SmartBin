import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reportType: { type: String, required: true }, // e.g., "Monthly Report"
  generatedDate: { type: Date, default: Date.now },
  fuelExpenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fuel" }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
  totalExpenses: { type: Number, required: true }
});

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);

export default Report;
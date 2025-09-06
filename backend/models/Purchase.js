import mongoose from "mongoose";

const allowedTimes = ["10:00", "11:00", "12:00"];
const sriLankaDistricts = [
  "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya","Galle","Matara","Hambantota",
  "Jaffna","Kilinochchi","Mannar","Vavuniya","Mullaitivu","Batticaloa","Ampara","Trincomalee",
  "Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla","Monaragala","Ratnapura","Kegalle"
];

const purchaseSchema = new mongoose.Schema({
  userSub: { type: String, required: true, index: true },        // from IdP token
  username: { type: String, required: true },                    // from IdP token
  email: { type: String },                                       // from IdP token

  productName: { type: String, required: true },                 // from list
  quantity: { type: Number, min: 1, max: 999, required: true },

  message: { type: String, maxlength: 1000 },                    // sanitized server-side

  purchaseDate: { type: Date, required: true },                  // today or later, not Sunday
  deliveryTime: { type: String, enum: allowedTimes, required: true },
  deliveryDistrict: { type: String, enum: sriLankaDistricts, required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Purchase", purchaseSchema);

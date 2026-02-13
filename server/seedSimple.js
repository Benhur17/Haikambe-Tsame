const mongoose = require("mongoose");
const Member = require("./models/Member");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✓ Connected to MongoDB");
    
    // Create a simple test member
    const testMember = await Member.create({
      fullName: "Test Member",
      gender: "Male",
      dateOfBirth: new Date("1990-01-01"),
      status: "Living",
      generation: 1
    });
    
    console.log("✓ Created test member:", testMember.fullName);
    console.log("✓ Total members:", await Member.countDocuments());
    
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });

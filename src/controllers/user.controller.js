import { asynchHandler } from "../utils/asychhandler.js";

const registerUser = asynchHandler(async (req, res) => {
 return res.status(200).json({
    message: "chai aur code",
  });
});

export { registerUser };

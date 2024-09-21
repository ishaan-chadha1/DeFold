import { WorldID } from "@worldcoin/id";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { merkle_root, nullifier_hash, proof, action_id, signal } = req.body;

  try {
    // Create a WorldID instance with your Worldcoin App ID
    const worldID = new WorldID("app_da7fe4a0209edf22695b1f66f1c775a0"); // Your Worldcoin App ID

    // Verify the proof using Worldcoin's API
    const result = await worldID.verify({
      merkle_root,
      nullifier_hash,
      proof,
      action_id,
      signal,
    });

    if (result.success) {
      console.log("Proof verified successfully:", result);
      return res.status(200).json({ success: true, message: "Worldcoin proof verified!" });
    } else {
      console.error("Verification failed:", result);
      return res.status(400).json({ success: false, message: "Verification failed" });
    }
  } catch (error) {
    console.error("Error verifying proof:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

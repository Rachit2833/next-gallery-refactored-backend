const supabase = require("../../worker-blur/supabase")

 async function uploadFile(name,fileBuffer,fileType) {
  const blob = new Blob([fileBuffer], { type: fileType });
  const { data, error } = await supabase.storage
    .from("Images2.0")
    .upload(name, blob);
  return { data, error };

}
module.exports = uploadFile;


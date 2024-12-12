async function uploadFile(file) {
  const { data, error } = await supabase.storage
    .from("bucket_name")
    .upload("file_path", file);
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
}

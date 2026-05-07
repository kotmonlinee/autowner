# Supabase Storage Setup

The image upload feature requires a public Supabase Storage bucket named `post-images`.

## Step 1: Create the bucket

Go to your Supabase Dashboard:

1. Navigate to **Storage** in the left sidebar
2. Click **New Bucket**
3. Name it exactly: `post-images`
4. Check **Public bucket**
5. Click **Create bucket**

## Step 2: Configure bucket policies

After creating the bucket, you need to add SQL policies that allow authenticated users to upload and read images.

Go to **SQL Editor** in the Supabase Dashboard and run:

```sql
-- Allow public read access to all objects in the post-images bucket
CREATE POLICY "Public read access for post-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'post-images');

-- Allow authenticated users to upload to post-images
CREATE POLICY "Authenticated users can upload to post-images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'post-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own uploads"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'post-images'
  AND auth.uid() = owner
);
```

## Step 3: Verify

Once the bucket and policies are in place, you can test the upload by:

1. Sign in to AutOwner
2. Go to /submit
3. Use the image uploader to upload an image
4. The image URL should be publicly accessible

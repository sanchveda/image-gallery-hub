-- Create albums table
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create album_images junction table
CREATE TABLE public.album_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  image_src TEXT NOT NULL,
  image_title TEXT NOT NULL,
  image_category TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for albums
CREATE POLICY "Users can view their own albums" 
ON public.albums 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own albums" 
ON public.albums 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own albums" 
ON public.albums 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own albums" 
ON public.albums 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for album_images (based on album ownership)
CREATE POLICY "Users can view images in their albums" 
ON public.album_images 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.albums 
    WHERE albums.id = album_images.album_id 
    AND albums.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add images to their albums" 
ON public.album_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.albums 
    WHERE albums.id = album_images.album_id 
    AND albums.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update images in their albums" 
ON public.album_images 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.albums 
    WHERE albums.id = album_images.album_id 
    AND albums.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete images from their albums" 
ON public.album_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.albums 
    WHERE albums.id = album_images.album_id 
    AND albums.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_albums_updated_at
BEFORE UPDATE ON public.albums
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
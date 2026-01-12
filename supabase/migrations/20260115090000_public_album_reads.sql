-- Allow public read access to albums and album images.
drop policy if exists "Users can view their own albums" on public.albums;
create policy "Public can view albums"
on public.albums
for select
using (true);

drop policy if exists "Users can view images in their albums" on public.album_images;
create policy "Public can view album images"
on public.album_images
for select
using (true);

add gallery photos here

place individual jpg, jpeg, png, webp, avif, or gif images directly in this folder

from the repository folder run the command below after adding, renaming, or removing images

```sh
node scripts/sync-gallery.mjs
```

the gallery uses filename order so number filenames to choose the order

photos appear in a compact collage

hover over an image for a full preview or tap to open it

optional descriptions and captions go in the gallery list in the content file
use file for the exact filename, alt for a description, and caption for visible text
these details are preserved when the file list is refreshed

include the refreshed gallery script and images when publishing the site

list filenames in the exclusion file to hide photos from the gallery while keeping the original assets

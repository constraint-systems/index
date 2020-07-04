#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
base=`echo $DIR | sed 's|\(.*\)/.*|\1|'`
relpath="$base/content/gallery/"
date=`date '+%FT%T'`

timestamp=`date '+%Y-%m-%d-%H%M%S'`
filename="$timestamp.md"
place="$relpath$filename"

echo "creating file $place"

echo "---
date: $date" > "$place"

echo "Image:"
read image_path
echo "image: $image_path" >> "$place"

echo "Source:"
read source
echo "Source: $source" >> "$place"

echo "Author:"
read author
echo "authors:
  - $author" >> "$place"

echo "Tool:"
read tool
echo "tools:
  - $tool" >> "$place"

echo "---
" >> "$place"

echo "your post has been created at $place"


# Album

This is a simple script to create and show albums for photos and other files. All data is stored as JSON, in a format very similar to my [Bookmarks script](https://github.com/Schnark/bookmarks). You can view an example (in German, but note that the script itself also supports English) at https://schnark.github.io/album/example/index.html. Note that the repository is managed as described in https://xkcd.com/1597/.

## Usage

Copy the file `empty.html` to the folder with your images, rename it to any name you prefer. You can adapt the URL to `load.js` to a local copy if you want to, in this case you also need the files from `res-show`, as well as `edit.html` and the files from `res-edit`.

The next step is to add your data. You can change the language (parameter `"lang"`, possible values are `"en"` and `"de"`) and add a title (parameter `"title"`). If you do not want to have the album in the same folder as your images, add a parameter `"path"` with the path to the images and set `allowPath` to `true` in your local copy of `res-show/album.js`.

Then you have three different ways to add your photos (or other files):
* You can just open your new album and use the edit function to add files and edit them.
* You can use `edit.html` (this is linked in the export dialog of the album, or just use it directly).
* You can manually edit the data.

In all cases you have to manually update the data in your album with the new data. When you use the edit function in the album just export your data when you are done and copy it into the right place.

The functions of the album should be self-explanatory, the separate editing script (which actually only allows adding files, not editing them) is a bit more rough, but also a bit more convenient when adding a large number of files.

When you manually edit the data you can refer to the documentation below for details.

## Features

The album provides the following functions:
* Select an image to show the info about it. Click again to toggle a large view. Or use the arrow keys and Enter and Escape. You can also hide the sidebar to only show on hover.
* Filter the files according to different criteria. Note that folders will always show if some of their contents match.
* Edit the data of the selected file or add new items. Don’t forget to export and update the JSON data.

## Data format for items
### Common data

The following attributes are possible for all types, and allow you to describe the item:

* `"title"`: short title
* `"desc"`: description, separate paragraphs by blank lines
* `"date"`: date when the photo was taken, should be in the form `YYYY-MM-DDThh:mm:ss±hh:mm` or an initial part of it, optionally followed by `|` and a free form text, but may also use any other form, Some examples: `"2015-06-02T12:00:00+02:00"`, `"2000-08"`, `"2024-03-31|easter 2024"`, `"1990 (?)"`
* `"place"`: place where the photo was taken
* `"author"`: name of photographer
* `"camera"`: used camera
* `"stars"`: star rating as a number from 1 to 5
* `"tags"`: array of strings for arbitrary tags

### Files

The following attributes are possible for images, videos, audios and other files:

* `"type"` (mandatory): `"image"`, `"video"`, `"audio"` or `"other"`
* `"path"` (mandatory): path to the file, relative to the base path (or as `data:`-URI)
* `"poster"`: for videos, path to a poster image
* `"thumb"`: for images and videos, path to a thumbnail, should be a `data:`-URI
* `"size"`: file size in bytes
* `"w"`, `"h"`: width and height of the file in pixels (where applicable)
* `"dur"`: duration of the file in seconds (where applicable)
* `"annotations"`: annotations for parts of the file, an object with the annotations as keys and the region as SVG elements as values, `w` and `h` must be set to use this

Also all of the common data can be used.

### Headlines

The following attributes are possible for headlines:

* `"type"` (mandatory): `"title"`
* `"title"` (mandatory): headline
* `"level"`: level of the headline, a number from 2 (default) to 5

Also all the rest of the common data can be used.

### Separator

The following attributes are possible for separators:

* `"type"` (mandatory): `"separator"`

The common data may be used, but will never be shown (it will be used for filtering, though, so it might be useful in some situations).

### Folder

The following attributes are possible for folders:

* `"type"` (mandatory): `"folder"`
* `"path"`: optional path for all files in the folder, especially for the case where the folder represents a real folder in the file system
* `"poster"`: poster image for the folder, may be either an URL as string or a reference to a file in the folder as index number
* `"content"` (mandatory): array with the items in the folder

Also all of the common data can be used.

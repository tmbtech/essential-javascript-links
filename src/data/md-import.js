var fs = require('fs'),
		md = require('markdown').markdown;

var markdownPath = 'essential-javascript-links.md',
    moreMetaData = {
      path: 'theBookData.json',
      id: 'theBookData'
    },
    jsonOutPath = 'the-big-data.json';

fs.readFile(markdownPath, {encoding: 'UTF-8', flag: 'r'}, function (err, data) {
	if (err) return;

  var allLinks = [],
      categories = [];
      currentCategory = "",
      current = {},
      moreMeta = [],
      moreMetaIndex = {},
      currentMeta = {},
      currentMetaIndex = {};

  moreMeta = JSON.parse(fs.readFileSync(moreMetaData.path, 'utf8'))[moreMetaData.id];
  moreMeta.forEach(function(el) {
    moreMetaIndex[el.title] = el.items;
  });

	data.split(/\r?\n/).forEach( function(line) {
    var match;

    if ( match = line.match(/^\s*#+\s(.*)$/) ) {
      // Category header
      currentCategory = match[1];
      categories.push(currentCategory);

      if (currentMeta = moreMetaIndex[currentCategory]) {
        currentMetaIndex = [];
        currentMeta.forEach(function(el, i) {
          currentMetaIndex[el.title] = el;
        });
      }
    } else if ( match = line.match(/^\s*[\*\+\-]\s+\[(.+?)\]\((.+?)\)(\s+(.*))?$/) ) {
      current = {
        title: match[1],
        href:  match[2],
        short_description: match[4],
        categories: [currentCategory]
      };
      enhanceMeta(current, currentMetaIndex[current.title]);
//      current.rank = current.rank || 0; // no rank? end of the line for you.
      allLinks.push(current);
    }

    function enhanceMeta(rec, meta) {
      if (!meta || typeof meta != 'object')
        return;

      if (meta.author)
        rec.author = meta.author;

      if (meta.description[0] &&
          ( !(rec.short_description) || 0 == rec.short_description.indexOf('by') )
      )
        rec.short_description = meta.description[0];

      if (meta.description[1])
        rec.long_description = meta.description[1];

      if (meta.tags)
        rec.tags = meta.tags;

      if (meta.level)
        rec.level = meta.level;

      if (meta.rank)
        rec.rank = meta.rank;
    }
  });

  var theBigString = JSON.stringify({allTheLinks: allLinks, linkCategories: categories}, null, 2);
  fs.writeFile(jsonOutPath, theBigString);
});

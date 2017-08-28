const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var URL = 'https://www.cs.mcgill.ca/academic/courses';

JSDOM.fromURL(URL).then(parseHtml);

function parseHtml(dom) {
  var doc= dom.window.document;
  var courses = doc.getElementById('courses');

  var children = courses.children;

  // every 2 children is a complete course
  for(var i=0; i < children.length - 1; i++) {
    // do we have more dom methods on these..?
  }
}

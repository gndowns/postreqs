const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var URL = 'https://www.cs.mcgill.ca/academic/courses';

var data = {};

JSDOM.fromURL(URL).then(parseHtml);

function parseHtml(dom) {
  var doc= dom.window.document;
  var courses = doc.getElementById('courses');

  var children = courses.children;

  // every 2 children is a complete course
  for(var i=0; i < children.length - 1; i+=2) {
    var code = children[i].id;
    data[code] = {code: code};
    var prereqs = children[i+1].children[1].children[3].textContent.split("Prerequisites: ")[1];

    prereqs = prereqs.trim().replace('.','').split(", ");
    prereqs = !prereqs[0] ? [] : prereqs
    data[code].prereqs = prereqs;
    // look for comp pre reqs
    for(var j=0; j<prereqs.length; j++) {
      comp_pres = prereqs[j].split("COMP ");
      if(comp_pres.length > 1) {
        console.log(comp_pres[1].split()[0]);
      }
      console.log();
    }
  }
  // console.log(JSON.stringify(data,null,2));
}

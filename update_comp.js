const fs = require('file-system');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var courseTree = openTree();

var URL = 'https://www.cs.mcgill.ca/academic/courses';

var data = {};

JSDOM.fromURL(URL).then(parseHtml);

function openTree() {
  const PATH = './tree.json';
  try {
    var tree = require(PATH);
  } catch(e) {
    fs.writeFileSync(PATH, '');
  }
}

function fromCode(code) {
  if(!data[code]) {
    data[code] = {
      code: code,
      postreqs: []
    };
  }
  return data[code];
}

function addPostreq(code, postreqCode) {
  var thisCourse = fromCode(code);
  thisCourse.postreqs.push(postreqCode);
}

function parseHtml(dom) {
  var doc = dom.window.document;
  var courses = doc.getElementById('courses');

  var children = courses.children;


  // every 2 children is a complete course
  for(var i=0; i < children.length - 1; i+=2) {
    var prereqs = children[i+1].children[1].children[3].textContent.split("Prerequisites: ")[1];
    prereqs = prereqs.trim().replace('.','').split(", ");
    prereqs = !prereqs[0] ? [] : prereqs

    var code = children[i].id;
    var thisCourse = fromCode(code);
    thisCourse.prereqs = prereqs;

    // look for comp pre reqs
    for(var j=0; j<prereqs.length; j++) {
      comp_pres = prereqs[j].split("COMP ");

      for(var k=1; k < comp_pres.length; k++) {
        var prereqCode = comp_pres[k].split(' ')[0];

        var prereqCourse = fromCode(prereqCode);

        addPostreq(prereqCode, code);
      }
    }
  }
  // console.log(JSON.stringify(data,null,2));
}

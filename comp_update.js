const fs = require('file-system');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const TREE_PATH = './tree.json';

var tree = openTree();

var URL = 'https://www.cs.mcgill.ca/academic/courses';

JSDOM.fromURL(URL).then(parseHtml);

function openTree() {
  try {
    var tree = require(TREE_PATH);
  } catch(e) {
    var tree = {};
    fs.writeFileSync(PATH, JSON.stringify(tree));
  }
  return tree;
}

function fromCode(code) {
  if(!tree[code]) {
    tree[code] = {
      code: code,
      postreqs: []
    };
  }
  return tree[code];
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

    var thisCourseCode = 'Comp ' + children[i].id;
    var thisCourseNode = fromCode(thisCourseCode);
    thisCourseNode.prereqs = prereqs;

    // look for comp pre reqs
    for(var j=0; j<prereqs.length; j++) {

      // we need a better way to split prereqs
      // can't just do it by comp codes
      comp_pres = prereqs[j].split("COMP ");

      for(var k=1; k < comp_pres.length; k++) {
        var prereqCode = comp_pres[k].split(' ')[0];

        var prereqCourse = fromCode(prereqCode);

        addPostreq(prereqCode, thisCourseCode);
      }
    }
  }
  fs.writeFile(TREE_PATH, JSON.stringify(tree,null,2)+'\n');
  console.log(JSON.stringify(tree,null,2));
}

var canvas;
var gl;

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
   var m4 = twgl.m4;
  var Simba = LoadedOBJFiles["Simba.obj"];
var gSimba = Simba.groups["simba02"];


  canvas = document.getElementById("glcanvas");

     var slider1 = document.getElementById("slider1");
    slider1.value = 50;
    //var slider2 = document.getElementById("slider2");
    //slider2.value = -68;
  //console.log("yooo");

  initWebGL();      // Initialize the GL context

   // Read shader source
    var vertexSource = document.getElementById("vs").text;
    var fragmentSource = document.getElementById("fs").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);     
    
    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);

    // this gives us access to the matrix uniform
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
    shaderProgram.Pmatrix = gl.getUniformLocation(shaderProgram,"uP");

    shaderProgram.normalMatrix = gl.getUniformLocation(shaderProgram,"normalMatrix");

/*
    var vertexPos_cube = new Float32Array(
        [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
           1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
           1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
          -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
          -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
           1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);


    var triangleIndices_cube = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
        20,21,22,  20,22,23 ]); // back

        */

    var vertexPos = new Float32Array(23130);
    var faces = gSimba.faces;
    var vertices = gSimba.vertices;
    var k =0;
  
    for(var i = 0;i<faces.length;i++){   //for each face
        var face = faces[i];
        for(var n = 0;n < face.length;n++){ //for each vertex
            var indices = face[n];
            var vertex = vertices[indices[0]] //get the vertex (indices[0] is position index)
          
            for(var j = 0;j < 3;j++){//for x, y, z in that vertex
              vertexPos[k] = vertex[j]; //add to sum
              k++;
            }

        }
     
    }

    k = 0;
    var vertexNormals = new Float32Array(23130);
    for(i = 0;i<faces.length;i++){   //for each face
        face = faces[i];
        for(n = 0;n < face.length;n++){ //for each vertex
            indices = face[n];
            vertex = vertices[indices[2]] //get the vertex (indices[0] is position index)
          
            for(j = 0;j < 3;j++){//for x, y, z in that vertex
              vertexNormals[k] = vertex[j]; //add to sum
              k++;
            }

        }}

/*
    k = 0;
    var vertexTextureCoords = new Float32Array(15420);
    for(i = 0;i<faces.length;i++){   //for each face
        face = faces[i];
        for(n = 0;n < face.length;n++){ //for each vertex
            indices = face[n];
            vertex = vertices[indices[1]] //get the vertex (indices[0] is position index)
          
            for(j = 0;j < 2;j++){//for x, y, z in that vertex
              vertexTextureCoords[k] = vertex[j]/120.0; //add to sum
              k++;
            }

        }
     
    } */
   
    /*
    var trianglePosBuffer_cube = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_cube);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos_cube, gl.STATIC_DRAW);
    trianglePosBuffer_cube.itemSize = 3;
    trianglePosBuffer_cube.numItems = 24;

    var indexBuffer_cube = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_cube);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices_cube, gl.STATIC_DRAW);    
*/

    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 7710;

     var triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    triangleNormalBuffer.itemSize = 3;
    triangleNormalBuffer.numItems = 7710; 

/*
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 7710; */



   function draw() {
  // Only continue if WebGL is available and working

    var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = -68*0.01*Math.PI;
        //slider2.value*0.01*Math.PI;
    
        // Circle around the y-axis
        var eye = [40 * Math.cos(angle1),35.0,40 * Math.sin(angle1)];
        var target = [0,8,0];
        var up = [0,1,0];
    
        var tModel = m4.multiply(m4.scaling([0.1,0.1,0.1]),m4.axisRotation([1,1,1],angle2));
        var tCamera = m4.inverse(m4.lookAt(eye,target,up));
        var tProjection = m4.perspective(Math.PI/4,1,10,1000);
        var tMV = m4.multiply(tModel,tCamera);
        var tMVP=m4.multiply(m4.multiply(tModel,tCamera),tProjection);

        var normMatrix = m4.inverse(m4.transpose(m4.multiply(tModel,tCamera)));
        //normMatrix = mat3(normMatrix);
        console.log(normMatrix);
  //gl is an object but an if statement evaluates anything that is not 0 as being "true"...gl is some pointer, right?. 
  //However, the keyword true only refers to 1

        gl.clearColor(73.0/255.0, 0, 178/255.0, 1.0);  // Set clear color to black, fully opaque          
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
      
       gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);

       gl.uniformMatrix4fv(shaderProgram.normalMatrix,false,normMatrix);

       gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);

       gl.uniformMatrix4fv(shaderProgram.Pmatrix,false,tProjection);
       //gl.uniformMatrix4fv

       /*
       gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_cube);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer_cube.itemSize,
          gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_cube);

         gl.drawArrays(gl.TRIANGLES, 0, trianglePosBuffer_cube.numItems);
        */

       gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
          gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
          gl.FLOAT, false, 0, 0); 

        /*
         gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize,
          gl.FLOAT, false, 0, 0); */

        gl.drawArrays(gl.TRIANGLES, 0, trianglePosBuffer.numItems);
  } 
  slider1.addEventListener("input",draw);
    
  draw();
}

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
  gl = null;
  //console.log(!gl);

  try {
    gl = canvas.getContext("webgl");

  }
  catch(e) {
    console.log("couldnt get context or something");
  }

  // If we don't have a GL context, give up now

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}
var grobjects = grobjects || [];

var Shadow = undefined;

(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;


    // constructor for Cubes
    Shadow = function Shadow(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Shadow.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["house-shadow-vs", "house-shadow-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-1.1,  .5,-.5,-1.1,  .5, .5,-1.1,        -.5,-.5,-1.1,  .5, .5,-1.1, -.5, .5,-1.1,    // z = 0
                    -.5,-.5, 1.1,  .5,-.5, 1.1,  .5, .5, 1.1,        -.5,-.5, 1.1,  .5, .5, 1.1, -.5, .5, 1.1,    // z = 1
                    -.5,-.5,-1.1,  .5,-.5,-1.1,  .5,-.5, 1.1,        -.5,-.5,-1.1,  .5,-.5, 1.1, -.5,-.5, 1.1,    // y = 0
                    -.5, .5,-1.1,  .5, .5,-1.1,  .5, .5, 1.1,        -.5, .5,-1.1,  .5, .5, 1.1, -.5, .5, 1.1,    // y = 1
                    -.5,-.5,-1.1, -.5, .5,-1.1, -.5, .5, 1.1,        -.5,-.5,-1.1, -.5, .5, 1.1, -.5,-.5, 1.1,    // x = 0
                     .5,-.5,-1.1,  .5, .5,-1.1,  .5, .5, 1.1,         .5,-.5,-1.1,  .5, .5, 1.1,  .5,-.5, 1.1,     // x = 1
                    -.5, .5, 1.1,  0.0, 1.3, 1.1, .5, 0.5, 1.1,      -.5,.5,-1.1,  0.0, 1.3, -1.1,  0.5, 0.5, -1.1,
                    0.0, 1.3, 1.1,  .5, 0.5, 1.1,  0.5, 0.5, -1.1,    0.0, 1.3, 1.1,  0.5, 0.5, -1.1, 0.0, 1.3, -1.1,
                    0.0, 1.3, 1.1,  -0.5, 0.5, 1.1, -0.5, 0.5, -1.1,  0.0, 1.3, 1.1,  -0.5, 0.5, -1.1, 0.0, 1.3, -1.1
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                   0,0,1, 0,0,1, 0,0,1,         0,0,-1, 0,0,-1, 0,0,-1,
                   0,1,0, 0,0,1, 0,0,1,          0,1,0, 0,0,1, 0,1,0,
                   0,1,0, 0,0,1, 0,0,1,         0,1,0, 0,0,1, 0,0,1,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Shadow.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Shadow.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
//grobjects.push(new Cube("cube1",[-2,0.5,   0],1) );
//grobjects.push(new Cube("cube2",[ 2,0.5,   0],1, [1,1,0]));
//grobjects.push(new Cube("cube3",[ 0, 0.5, -2],1 , [0,1,1]));
//grobjects.push(new Cube("cube4",[ 0,0.5,   2],1));

grobjects.push(new Shadow("shadow 1",[0.0,0.1, 0.0],1.0, [0.0,0.0,0.4]) );
grobjects.push(new Shadow("shadow 2",[2.0,0.1, 0.0],2, [.7,.3,.5]) );
grobjects.push(new Shadow("shadow 3",[-2.0,0.1, 0.0],2, [.3, .3, .3]));


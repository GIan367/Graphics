/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cube = undefined;
var SpinningCube = undefined;
//var Tower = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    var m4 = twgl.m4;
    var v3 = twgl.v3;
    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;


    //var buffers2 = undefined;
    //var shaderProgram2 = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    //-.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    //-.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    .5, -.5, .5,  -.5,-.5,.5,  0, .7, .5,
                    -.5,-.5,.5, .5,-.5,.5, 0, -.5, -1.6
                    //-.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    //-.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     //.5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1
                    
                ] },
                vnormal : {numComponents:3, data: [
                   // 0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    //0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,-1,0, 0,-1,0, 0,-1,0, 
                    0,-1,0, 0,-1,0, 0,-1,0, 
                    //0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    //-1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    //1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Cube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world


        var t = drawingState.curveFactor * 0.09;

         var p0=[3,7,2];
        var d0=[-11,0,0];
        var p1=[-2,0,2];
        var d1=[-5,-3,0];
    
        var P = [p0,d0,p1,d1]; // All the control points
        var Ca = function(t_) {return Cubic(Hermite,P,t_);};
         var Ca_d = function(t_) {return Cubic(HermiteDerivative,P,t_);};

         var p2=[-2,0 ,2];
        var d2=[-11,0,0];
        var p3=[-5,7,2];
        var d3=[-5,-3,0];
    
        var Pb = [p2,d2,p3,d3];
        var Cb = function(t_) {return Cubic(Hermite,Pb,t_);};
         var Cb_d = function(t_) {return Cubic(HermiteDerivative,Pb,t_);};

         var p4=[-5,7,2];
        var d4=[-11,0,0];
        var p5=[-2,0,-2];
        var d5=[5,3,0];
    
        var Pc = [p4,d4,p5,d5];
        var Cc = function(t_) {return Cubic(Hermite,Pc,t_);};
         var Cc_d = function(t_) {return Cubic(HermiteDerivative,Pc,t_);};

         var p6=[-2,0,-2];
        var d6=[13,0,-2];
        var p7=[-3,5.5,-2];
        var d7=[-5,3,0];
    
        var Pd = [p6,d6,p7,d7];
        var Cd = function(t_) {return Cubic(Hermite,Pd,t_);};
         var Cd_d = function(t_) {return Cubic(HermiteDerivative,Pd,t_);};

         var p8=[-3,5.5,-2];
        var d8=[-13,0,-2];
        var p9=[-2,0,-5];
        var d9=[5,0,-3];
    
        var Pe = [p8,d8,p9,d9];
        var Ce = function(t_) {return Cubic(Hermite,Pe,t_);};
         var Ce_d = function(t_) {return Cubic(HermiteDerivative,Pe,t_);};

         

         var p10=[-2,0,-5];
        var d10=[13,0,-2];
        var p11=[5,7,-5];
        var d11=[5,0,2];
    
        var Pf = [p10,d10,p11,d11];
        var Cf = function(t_) {return Cubic(Hermite,Pf,t_);};
         var Cf_d = function(t_) {return Cubic(HermiteDerivative,Pf,t_);}; 

         var p12=[5,7,-5];
        var d12=[13,0,-2];
        var p13=[3,0,-10];
        var d13=[-5,0,1];
    
        var Pg = [p12,d12,p13,d13];
        var Cg = function(t_) {return Cubic(Hermite,Pg,t_);};
         var Cg_d = function(t_) {return Cubic(HermiteDerivative,Pg,t_);}; 

          var p14=[3,0,-10];
        var d14=[-153,0,-2];
        var p15=[7,-2,7];
        var d15=[5,0,1];
    
        var Ph = [p14,d14,p15,d15];
        var Ch = function(t_) {return Cubic(Hermite,Ph,t_);};
         var Ch_d = function(t_) {return Cubic(HermiteDerivative,Ph,t_);}; 

         var p16=[7,-2,7];
        var d16=[10,5,-1];
        var p17=[3,7,2];
        var d17=[-2,0,0];
    
        var Pi = [p16,d16,p17,d17];
        var Ci = function(t_) {return Cubic(Hermite,Pi,t_);};
         var Ci_d = function(t_) {return Cubic(HermiteDerivative,Pi,t_);}; 

      
       //var Tmodel_trans=m4.translation(Cubic(Hermite,P,t));
         //var Tmodel_rot=m4.lookAt([0,0,0],Cubic(HermiteDerivative,P,t),[0,1,0]);
        



    var Cagg = function(t_){
      if(t_<1.0) return Ca(t_);
      if(t_<2.0) return Cb(t_-1.0);
      if(t_<3.0) return Cc(t_-2.0);
      if(t_<4.0) return Cd(t_-3.0);
      if(t_<5.0) return Ce(t_-4.0);
      if(t_<6.0) return Cf(t_-5.0);
      if(t_<7.0) return Cg(t_-6.0);
      if(t_<8.0) return Ch(t_-7.0);
      return Ci(t_-8.0);
    }
    
    var Cagg_d = function(t_){
      if(t_<1.0) return Ca_d(t_);
      if(t_<2.0) return Cb_d(t_-1.0);
      if(t_<3.0) return Cc_d(t_-2.0);
      if(t_<4.0) return Cd_d(t_-3.0);
      if(t_<5.0) return Ce_d(t_-4.0);
      if(t_<6.0) return Cf_d(t_-5.0);
      if(t_<7.0) return Cg_d(t_-6.0);
      if(t_<8.0) return Ch_d(t_-7.0);
      return Ci_d(t_- 8.0);
    }

 var Tmodel_rot=m4.lookAt([0,0,0],Cagg_d(t),[0,1,0]);

        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var finModel = twgl.m4.multiply(modelM, Tmodel_rot);
        // var Tmodel=m4.multiply(Tmodel_rot,Tmodel_trans);
         //modelM = m4.multiply(modelM, Tmodel);

        twgl.m4.setTranslation(finModel,Cagg(t),finModel);
        //twgl.m4.translate(Tmodel, this.position);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        var normMatrix = twgl.m4.inverse(twgl.m4.transpose(twgl.m4.multiply(finModel, drawingState.view)));
        twgl.setUniforms(shaderProgram,{ normalMatrix: normMatrix,
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: finModel});
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cube.prototype.center = function(drawingState) {
        return this.position;
    }

    function Cubic(basis,P,t){
    var b = basis(t);
    var result=v3.mulScalar(P[0],b[0]);
    v3.add(v3.mulScalar(P[1],b[1]),result,result);
    v3.add(v3.mulScalar(P[2],b[2]),result,result);
    v3.add(v3.mulScalar(P[3],b[3]),result,result);
    return result;
  }

  var Hermite = function(t) {
      return [
        2*t*t*t-3*t*t+1,
        t*t*t-2*t*t+t,
        -2*t*t*t+3*t*t,
        t*t*t-t*t
      ];
  }

  var HermiteDerivative = function(t) {
      return [
        6*t*t-6*t,
        3*t*t-4*t+1,
        -6*t*t+6*t,
        3*t*t-2*t
      ];
  }




    /*
    Tower = function Tower(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    } 

    
    //Tower.prototype = Object.create(Cube.prototype);

    
      Tower.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram2) {
            shaderProgram2 = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers2) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5,     // x = 1
                    
                    
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    
                ]}
            };
            buffers2 = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    }; 

    Tower.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram2.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram2,buffers2);
        twgl.setUniforms(shaderProgram2,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers2);
    };

    Tower.prototype.center = function(drawingState) {
        return this.position;
    }   */

    ////////
    // constructor for Cubes
    SpinningCube = function SpinningCube(name, position, size, color, axis) {
        Cube.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningCube.prototype = Object.create(Cube.prototype);
    SpinningCube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
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
    SpinningCube.prototype.center = function(drawingState) {
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
//grobjects.push(new Cube("cube4",[ 4,0.5,   2],1));

//grobjects.push(new Tower("tower 1",[0.0,0.5, 0.0],1) );
grobjects.push(new Cube("cube 1",[3.0,6.5, 3.0],1.0, [.3,.5,.2]) );
//grobjects.push(new SpinningCube("scube 1",[-2,0.5, -2],1) );
//grobjects.push(new SpinningCube("scube 2",[-2,0.5,  2],1,  [1,0,0], 'Y'));
//grobjects.push(new SpinningCube("scube 3",[ 2,0.5, -2],1 , [0,0,1], 'Z'));
//grobjects.push(new SpinningCube("scube 4",[ 2,0.5,  2],1));

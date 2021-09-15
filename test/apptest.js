const assert = require('chai').assert;
// const app=require('../app')
const maxi=require('../app').maxi;

describe ('App',function(){
  it('value should be less than total no of student',function(){
    let result=maxi();
    assert.isAbove(result,2);
  })
})

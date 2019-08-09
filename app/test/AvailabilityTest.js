class Availiability{
  /*
   * startTime(date) : starting time of this availiable period
   * duration(num): duration of availiable period
   * interval(num): meeting interval for this period
   * preferences(obj): preferences
   * preferences.repeats(boolean): whether this availiability period is repeated
   * preferences.repetition(num): how many time this period repeats
   */
  constructor(startTime, duration, interval, preferences){
    this.startTime = startTime;
    this.duration = duration;
    this.interval = interval;
    this.preferences = preferences;
  }
  /*
   * Changes this.startTime to startTime
   */
  changeStartTime(startTime){
    this.startTime = startTime;
  }
  /*
   * Changes this.duration to duration
   */
  changeDuration(duration){
    this.duration = duration
  }
  /*
   * Change this.preferences to newPreferences
   */
  changePreferences(newPreferences){
    this.preferences = newPreferences;
  }
  /*
   * Set this.availiability to availiability
   */
  changeInterval(interval){
    this.interval = interval;
  }
}
var assert = require('assert');
describe('Availiability', function() {
  describe('#constructor', function() {
    it('should create a new Availiability object with all the attributes', function() {
      let date = new Date();
      let obj = {repeats:true,
                 repetition: 2};
      const availiable = new Availiability(date,10,10,obj)
      assert.deepEqual(availiable.startTime, date);
      assert.deepEqual(availiable.duration, 10);
      assert.deepEqual(availiable.interval, 10);
      assert.deepEqual(availiable.preferences.repeats, true);
      assert.deepEqual(availiable.preferences.repetition, 2);
    });
  });
  describe('#change startTime', function() {
    it('should change startTime', function() {
      let date = new Date();
      let obj = {repeats:true,
                 repetition: 2};
      const availiable = new Availiability(date,10,10,obj)
      let date2 = new Date();
      availiable.changeStartTime(date2);
      assert.deepEqual(availiable.startTime, date2);
    });
  });
  describe('#changeDuration', function() {
    it('should change duration', function() {
      let date = new Date();
      let obj = {repeats:true,
                 repetition: 2};
      const availiable = new Availiability(date,10,10,obj);
      availiable.changeDuration(20)
      assert.deepEqual(availiable.duration, 20);
    });
  });
  describe('#changeInterval', function() {
    it('should change the interval', function() {
      let date = new Date();
      let obj = {repeats:true,
                 repetition: 2};
      const availiable = new Availiability(date,10,10,obj);
      availiable.changeInterval(20)
      assert.deepEqual(availiable.interval, 20);
    });
  });
  describe('#changePreferences', function() {
    it('should change the duration', function() {
      let date = new Date();
      let obj = {repeats:true,
                 repetition: 2};
      let obj2 = {repeats:false, repetition:0};
      const availiable = new Availiability(date,10,10,obj);
      availiable.changePreferences(obj2)
      assert.deepEqual(availiable.preferences, obj2);
    });
  });
});

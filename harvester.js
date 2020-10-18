let consts = require('constants');
let math = require('math');

module.exports = {
    spawn: function(spawn, body, target) {
        spawn = Game.spawns[spawn];
        if(_.isUndefined(spawn)) {
            return consts.ERROR_INVALID_ARGS;
        }
        target = Game.flags[target];
        if(_.isUndefined(target) || _.isUndefined(target.memory.target_id)) {
            return consts.ERROR_INVALID_ARGS;
        }
        let harvester = Game.creeps[target.memory.harvester];
        if(!_.isUndefined(harvester)) {
            return consts.ERROR_TARGET_BLOCKED;
        }
        let creep = Date.now();
        
        let is_spawned = spawn.spawnCreep(body, creep, { memory: { role: 'harvester', is_gathering: true, in_position: false, target: target.name  } });
        if(is_spawned = OK) {
            target.memory.harvester = creep;
        }
        return is_spawned;
    },
    tick: function(harvester) {
        let flag = Game.flags[harvester.memory.target];
        let target = Game.getObjectById(flag.memory.target_id);
        
        if(!harvester.memory.in_position && math.distance_squared(harvester, target) <= 2) {
            harvester.memory.in_position = true;
        } else if(harvester.memory.in_position && !(math.distance_squared(harvester, target) <= 2)) {
            harvester.memory.in_position = false;
        }
        let is_harvested = harvester.harvest(target);
        
        if(is_harvested == OK) {
            harvester.memory.is_gathering = true;
        } else {
            harvester.memory.is_gathering = false;
        }
        if(is_harvested == ERR_NOT_IN_RANGE) {
            harvester.moveTo(target);
        }
    }
}

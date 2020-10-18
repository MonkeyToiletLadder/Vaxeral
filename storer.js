module.exports = {
    spawn: function(spawn, body, target) {
        spawn = Game.spawns[spawn];
        if(_.isUndefined(spawn)) {
            return ERROR_INVALID_ARGS;
        }
        target = Game.flags[target];
        if(_.isUndefined(target) || _.isUndefined(target.memory.target_id)) {
            return ERROR_INVALID_ARGS;
        }
        let creep = Date.now();
        
        let is_spawned = spawn.spawnCreep(body, creep, { memory: { role: 'storer', tags: ['hauler'], is_gathering: true, target: target.name } });
        
        return is_spawned;
    }
}

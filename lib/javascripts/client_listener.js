var Asteroids = this.Asteroids = (this.Asteroids || {});
var SocketListener = Asteroids.SocketListener = {};

(function(global, SocketListener){

	var startListening = SocketListener.startListening = function (socket, game) {
		var debugFlag = true;

		function debug (log) {
			if (debugFlag) console.log(log)
		}

		// init / general stuff
		socket.on('connectionSuccessful', function() {
			console.log('socket connected to server ');
			game.status = 'connected';
		});

		socket.on('disconnect', function() {
			console.log('disconnected from server');
			game.status = 'disconnected';
		})

		socket.on('reconnecting', function() {
			console.log('reconnecting to server...');
			game.status = 'reconnecting...';
		})

		socket.on('connecting', function() {
			console.log('connecting');
			game.status = 'connecting';
		})

		socket.on('reconnect_failed', function() {
			conosole.log('Damn, can\'t reconect to the server!');
			game.status = 'disconnected!  =\'('
		})

		socket.on('testSuccess', function() {
			console.log('test received successfully!')
		});

		socket.on('test', function() {
			console.warn('I receieved test!')
		});

		socket.on('sessionsStatus', function (data) {
			console.log(data)
		});

		socket.on('sessionCreated', function() {
			console.log('session successfully created');
		})

		socket.on('foreignJoin', function() {
			console.log('Another user has joined the room');
		})

		// game stuff
		socket.on('addAsteroid', function (asteroidOpts) {
			debug('received asteroid')
			game.addAsteroid(asteroidOpts);
		})

		socket.on('addBlackHole', function (bhOpts) {
			debug('received black hole');
			game.foreignAddBlackHole(bhOpts);
		})

		socket.on('growBlackHole', function (amtOpts) {
			debug('grow black hole')
			game.foreignGrowBlackHole(amtOpts);
		})

		socket.on('explodeAsteroid', function (asteroidOpts) {
			debug('explodeAsteroid')
			var asteroid = game.get(asteroidOpts.id)

			game.explodeAsteroid(asteroid);
		})

		socket.on('fireShip', function (bulletOpts) {
			debug('firing foreign ship')
			game.fireForeignShip(bulletOpts);
		})

		socket.on('addShip', function (shipOpts) {
			debug('add foreign ship')
			game.addForeignShip(shipOpts);
		})

		socket.on('removeBullet', function (bulletOpts) {
			debug('remove bullet')
			game.foreignRemoveBullet(bulletOpts);
		})

		socket.on('powerForeignShip', function (shipOpts) {
			game.powerForeignShip(shipOpts.shipID);
		})

		socket.on('turnForeignShip', function (turnOpts) {
			game.turnForeignShip(turnOpts);
		})

		socket.on('dampenForeignShip', function (dampenOpts) {
			game.dampenForeignShip(dampenOpts);
		})

		socket.on('foreignHitShip', function (opts) {
			debug('foreignHitShip');
			game.foreignHitShip(opts);
		})

		socket.on('destroyedShip', function (shipIDOpt) {
			debug('destroyedShip');
			game.foreignDestroyedShip(shipIDOpt);
		})

		socket.on('levelUp', function() {
			game.levelUp();
		})

		socket.on('pause', function() {
			game.foreignPause();
		})

		socket.on('fullState', function (fullStateObject) {
			game.handleFullState(fullStateObject);
		})
	};

})(Asteroids, SocketListener)


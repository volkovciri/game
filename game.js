game =
{
	canvas:
	{
		load: function ()
		{
			let canvas = window.document.createElement ('canvas');
				canvas.style.background = '#000';
				canvas.style.left = 0;
				canvas.style.position = 'absolute';
				canvas.style.top = 0;

			canvas.resize = function ()
			{
				this.height = window.innerHeight;
				this.width = window.innerWidth;
			}

			canvas.context = canvas.getContext ('2d');
			game.canvas = canvas;
			game.canvas.resize ();
			window.document.body.appendChild (game.canvas);
		}
	},

	create:
	{
		box: function (_)
		{
			let box = game.create.object (_);
				box.redraw = _.redraw || 1;
				box.z = _.z || 0;

				box.draw = function ()
				{
					if (box.color) { game.canvas.context.fillStyle = box.color; }
					game.canvas.context.fillRect (box.x, box.y, box.w, box.h);
				}

				box.set =
				{
					set x (x)
					{
						box.trace ();
						box.x = x;
						box.trace ();
					},

					set y (y)
					{
						box.trace ();
						box.y = y;
						box.trace ();
					},

					set z (z)
					{
						box.trace ();
						box.z = z;
						box.trace ();
					}					
				}

				box.trace = function ()
				{
					box.redraw = 1;
					for (let id in game.object)
					{
						if (!game.object[id].redraw && game.get.boxinbox (box, game.object[id]))
						{
							game.object[id].trace ();
						}
					}
				}

			return box;
		},

		object: function (_)
		{
			let object = _ || {};
				object.id = _.id || game.id++;

			object.load = function ()
			{
				game.object[object.id] = object;
			}

			return object;
		}
	},

	draw: function (redraw)
	{
		let layer = {};

		for (let id in game.object)
		{
			if (layer[game.object[id].z] == undefined) { layer[game.object[id].z] = []; }
			if (redraw || game.object[id].redraw) { game.object[id].redraw = 0; layer[game.object[id].z].push (game.object[id]); }
		}

		for (let z in layer)
		{
			for (let id in layer[z])
			{
				layer[z][id].draw ();
			}			
		}
	},

	get:
	{
		boxinbox: function (a, b)
		{
			return ((Math.abs (a.x - b.x + 0.5 * (a.w - b.w)) < 0.5 * Math.abs (a.w + b.w)) && (Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) < 0.5 * Math.abs (a.h + b.h)));
		}
	},

	id: 0,

	load: function ()
	{
		game.window.load ();
		game.canvas.load ();
		game.scene.load ();
	},

	object: {},

	scene: {},

	update: function (event)
	{
		for (let id in game.object)
		{
			for (let method in game.object[id])
			{
				if (method == event.type)
				{
					game.object[id][method] (event);
				}
			}
		}
	},

	window:
	{
		load: function ()
		{
			window.onmousedown = game.update;
			window.onmousemove = game.update;
			window.onmouseup = game.update;
			window.onresize = function (event) { game.canvas.resize (); game.update (event); game.draw (1); }
			game.window.ontick (game.update);
		},

		ontick: function (update)
		{
			window.setInterval
			(
				function ()
				{
					game.window.time += game.window.tick;
					game.update ({ type: 'tick' });
					game.draw ();
				}
			);
		},

		tick: 25,
		time: 0
	}
}

window.onload = game.load;

game.scene.load = function ()
{
	game.create.box ({ color: '#f00', h: 100, w: 100, x: 100, y: 100, z: 2 }).load ();
	game.create.box ({ color: '#0f0', h: 100, w: 100, x: 80, y: 130, z: 1 }).load ();
	game.create.box ({ color: '#00f', h: 100, w: 100, x: 120, y: 160, z: 0 }).load ();
	game.draw ();
}
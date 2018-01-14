game =
{
	a: {},

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

			game.context = canvas.getContext ('2d');
			game.canvas = canvas;
			game.canvas.resize ();
			window.document.body.appendChild (game.canvas);
		}
	},

	create:
	{
		animation: function (_)
		{
			let animation = game.create.sprite (_);
				animation.a = _.a;
				animation.step = _.step || 0;
				animation.delay = _.delay || game.window.tick;
				animation.time = _.time || game.window.time;

			animation.animate = function ()
			{
				if (animation.loop ())
				{
					if (game.window.time - animation.time >= animation.delay)
					{
						animation.time = game.window.time;
						animation.step = (animation.step >= animation.a.length - 1) ? 0 : animation.step + 1;
						animation.i = animation.a[animation.step];
						
						animation.trace ();
					}
				}
			}

			animation.tick = function ()
			{
				animation.animate ();
			}

			return animation;
		},

		box: function (_)
		{
			let box = game.create.object (_);
				box.redraw = _.redraw || 1;
				box.z = _.z || 0;

				box.draw = function ()
				{
					if (box.color) { game.context.fillStyle = box.color; }
					game.context.fillRect (box.x, box.y, box.w, box.h);
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
		},

		sprite: function (_)
		{
			let sprite = game.create.box (_);
				sprite.aa = _.aa || 0;
				sprite.i = game.get.i (_.i);

				sprite.draw = function ()
				{
					game.context.imageSmoothingEnabled = sprite.aa;
					game.context.drawImage (sprite.i, sprite.x, sprite.y, sprite.w, sprite.h);
				}

			return sprite;
		},
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
		a: function (a)
		{
			let animation = (typeof (a) == 'object') ? a : game.a[a];
				animation = (animation) ? animation : {};
			return animation;
		},

		set animations (a)
		{
			for (id in a)
			{
				game.a[id] = [];
				for (let i = 0; i < a[id]; i++)
				{
					let image = new Image ();
						image.src = 'data/' + id + ' ' + i + '.png';
						game.a[id].push (image);
				}
			}
		},

		boxinbox: function (a, b)
		{
			return ((Math.abs (a.x - b.x + 0.5 * (a.w - b.w)) < 0.5 * Math.abs (a.w + b.w)) && (Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) < 0.5 * Math.abs (a.h + b.h)));
		},

		i: function (i)
		{
			let image = (typeof (i) == 'object') ? i : game.i[i];
				image = (image) ? image : new Image ();
			return image;
		},

		set images (i)
		{
			for (let n of i)
			{
				let image = new Image ();
					image.src = 'data/' + n + '.png';
				game.i[n] = image;
			}
		}
	},

	i: {},
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

//load res
game.get.animations =
{
	'test': 6
}

game.get.images =
[
	'test'
]

//game scenes
game.scene.load = function ()
{
	game.create.box ({ color: '#f00', h: 100, w: 100, x: 100, y: 100, z: 2 }).load ();
	game.create.box ({ color: '#0f0', h: 100, w: 100, x: 80, y: 130, z: 1 }).load ();
	game.create.box ({ color: '#00f', h: 100, w: 100, x: 120, y: 160, z: 3 }).load ();
	game.create.sprite ({ h: 100, i: 'test', w: 100, x: 200, y: 160, z: 0 }).load ();
	game.create.animation ({ a: game.a.test, delay: 1000,  h: 100, i: 'test', loop: () => 1, w: 100, x: 100, y: 70, z: 2 }).load ();
	game.draw ();
}
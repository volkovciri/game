game =
{
	canvas:
	{
		load: function ()
		{
			let canvas = window.document.createElement ('canvas');
				canvas.style.left = 0;
				canvas.style.position = 'absolute';
				canvas.style.top = 0;

			canvas.resize = function ()
			{
				this.height = window.innerHeight;
				this.width = window.innerWidth;
			}

			game.canvas = canvas;
			game.canvas.resize ();
			window.document.body.appendChild (game.canvas);
		}
	},

	load: function ()
	{
		game.window.load ();
		game.canvas.load ();
	}

	window:
	{
		load: function ()
		{

		}
	}
}

window.onload = game.load;
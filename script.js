const canvas = document.querySelector('canvas')
// запрашиваем у элемента его JavaScript-сущность, позволяющую на нем рисовать
const context = canvas.getContext('2d')

// размеры канваса в px
canvas.width = 1000
canvas.height = 1000

// контрольная точка - относительно нее будут двигаться остальные точки
const control = getCircle(canvas.width / 2, canvas.height / 2, 0)

// массив точек
const circles = []

// context.fillStyle = 'red'// каким цветом закрашивать фигуры
// context.strokeStyle = 'green'// каким цветом рисовать прямые линии
// context.lineWidth = 3// какой шириной в px рисовать прямые линии

// context.beginPath()// вызвать перед отрисовкой фигуры
// context.moveTo(100, 100)// поставить перо в точку x, y
// context.lineTo(200, 200)// в какую точку x, y провести прямую линию
// context.lineTo(200, 500)// в какую точку x, y провести прямую линию
// context.stroke()// нарисовать линию (отобразить)

// context.beginPath()// вызвать перед отрисовкой фигуры
// context.arc(500, 500, 20, 0, 2 * Math.PI)//арка в точке x, y радиуса r
// context.fill()// заполнить фигуру цветом
// context.stroke()// нарисовать периметр (отобразить)

// context.beginPath()// вызвать перед отрисовкой фигуры
// // прямоугольник с координатой левой верхней точки x, y, шириной, высотой
// context.rect(300, 300, 100, 200)
// context.fill()// заполнить фигуру цветом
// context.stroke()// отрисовать периметр

// запишем в массив circles определенное количество точек
for (let i = 0; i < 300; i++) {
	const x = getRandom(0, canvas.width)
	const y = getRandom(0, canvas.height)
	// вначале радиус точки будет равен 0
	const circle = getCircle(x, y, 0, 0, 0, getRandomColor())

	circle.distance = getDist(control, circle)
	// ищем угол точки относительно оси x. atan2() - возвращает арктангенс
	circle.angle = Math.atan2(circle.y - control.y, circle.x - control.x)

	// push - метод добавления элемента в массив
	circles.push(circle)
}

mouseWatcher(canvas, function (mouse) {
	control.x = mouse.x
	control.y = mouse.y
})

start()

function start () {
// функция регистрирует функцию tick перед следующим обновлением экрана
	requestAnimationFrame(tick)
}

// рекурсивная функция, делает так, чтобы вызываться при каждом обновлении экрана
function tick () {
	moveCircles()
	reloadCircles()

	clearCanvas()
	drawCircles()

	requestAnimationFrame(tick)
}

// функция заливает канвас одним цветом - чистит
function clearCanvas () {
	context.beginPath()
	context.fillStyle = 'black'
	context.rect(0, 0, canvas.width, canvas.height)
	context.fill()
}

// функция отрисовывает все точки
function drawCircles () {
	// цикл, который проходит по всем элементам массива
	for (const circle of circles) {
		drawCircle(circle.x, circle.y, circle.r, circle.color)
	}
}

// функция рисует кружок
function drawCircle (x, y, r, color) {
	context.beginPath()
	context.fillStyle = color
	context.arc(x, y, r, 0, 2 * Math.PI)
	context.fill()
}

// возвращает объект, который содержит координаты x, y и радиус r, угол точки, расстояние до контрольной точки
function getCircle (x, y, r, angle, distance, color) {
	return {
		// x: x,
		x,
		y,
		r,
		angle,
		distance,
		color
	}
}

// возвращает случайное число в диапазоне от min до max
function getRandom (min, max) {
	return min + Math.random() * (max - min + 1)
}

// функция двигает точки относительно контрольной точки
function moveCircles () {
	// проходимся по всем точкам
	for (const circle of circles) {
		// находим расстояние от контрольной точки до текущей и немного увеличиваем его
		// let dist = getDist(circle, control)
		// немного увеличиваем расстояние от контрольной точки до текущей
		circle.distance = circle.distance + circle.distance**0.35

		// задаем точке новые координаты x, y относительно dist
		circle.x = control.x + circle.distance * Math.cos(circle.angle)
		circle.y = control.y + circle.distance * Math.sin(circle.angle)
		// чем дальше точка от контрольной точки, тем большим будет ее радиус
		// circle.r = circle.distance**0.4
		circle.r = circle.distance*0.02
	}
}

/*
	функция лимитирования точек. Когда точка уходит за границу экрана,
	возвращает ее к центру экрана
*/
function reloadCircles () {
	for (const circle of circles) {
		if (circle.x < 0 || circle.x > canvas.width || circle.y < 0 || circle.y > canvas.height) {
			// делаем так, чтобы точка возрождалась на случайном маленьком расстоянии от контрольной точки
			circle.x = control.x + getRandom(-3, 3)
			circle.y = control.y + getRandom(-3, 3)
			circle.r = 0

			circle.distance = getDist(control, circle)
			// ищем угол точки относительно оси x. atan2() - возвращает арктангенс
			circle.angle = Math.atan2(circle.y - control.y, circle.x - control.x)
		}
	}
}

// функция находит расстояние между точками a и b
function getDist (a, b) {
	return ((a.x - b.x)**2 + (a.y - b.y)**2)**0.5
}

/*
	https://gist.github.com/Aleksey-Danchin/aeb89174608c55c64078659063d52f4b
	функция следит за координатами мыши
*/
function mouseWatcher (element, callback) {
	const mouse = {
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
	}

	const getMouseCopy = () => ({
		x: mouse.x,
		y: mouse.y,
		dx: mouse.dx,
		dy: mouse.dy,
	})

	element.addEventListener('mousemove', function (event) {
		const rect = element.getBoundingClientRect()
		const x = event.clientX - rect.left
		const y = event.clientY - rect.top

		mouse.dx = x - mouse.x
		mouse.dy = y - mouse.y

		mouse.x = x
		mouse.y = y

		callback(getMouseCopy())
	})
}

// функция возвращает случайный цвет
function getRandomColor () {
	const colors = ['black', 'blue', 'green', 'yellow', 'red', 'pink', 'gray', 'aqua', 'blueviolet', 'indigo', 'darkslategray', 'olive', 'purple', 'yellowgreen', 'chartreuse', 'goldenrod', 'maroon']
	const index = Math.floor(Math.random() * colors.length)

	return colors[index]
}

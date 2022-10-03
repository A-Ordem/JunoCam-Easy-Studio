let sourceR
let sourceG
let sourceB
let sourceMAP
let sourceRAW
let imgRGB
let imgRGBlow

let imgModified
let imgModifiedlow

let sel

let contraSlider;
let brightSlider;
let redSlider;
let greenSlider;
let blueSlider;
let hueSlider;
let satuSlider;

let contraPrevious = 0;
let brightPrevious = 0;
let redPrevious = 0;
let greenPrevious = 0;
let bluePrevious = 0;
let huePrevious = 0;
let satuPrevious = 0;

let contraSliderP;
let brightSliderP;
let redSliderP;
let greenSliderP;
let blueSliderP;
let hueSliderP;
let satuSliderP;

/* Analise para o raw:

altura de uma faixa -> sempre 128?

Dimensões dos raws:
1: 1648 x 6144
2: 1648 x 14592
3: 1648 x 5376
4: 1648 x 9984

Altura de cada canal:
1: altura/3 -> 2048 != 1648 -> n_fatias = 16
2: altura/3 -> 4864 != 1648 -> n_fatias = 38
3: altura/3 -> 1792 != 1648 -> n_fatias = 14
4: altura/3 -> 3328 != 1648 -> n_fatias = 26

*/

function setup() {
    createCanvas(677, 677)

    var input = createFileInput(handleFile, "true")
    input.position(0, 0)
    input.id("input-btn")
    var fragment = document.createDocumentFragment()
	fragment.appendChild(document.querySelector('#input-btn'))
	document.querySelector('#input-btn-container').appendChild(fragment)

    // document.querySelector('#input-btn').setAttribute("accept", ".zip,.rar,.7zip")
	document.querySelector('canvas').style.display = "none";
    
    sel = createSelect();
    sel.id("dropdown-examples")
    sel.option('13913-ImageSet');
    sel.option('13913-ImageSet');
    sel.option('13913-ImageSet');
    sel.selected('kiwi');
    sel.changed(handleExample);
	fragment.appendChild(document.querySelector('#dropdown-examples'))
	document.querySelector('#examples-dropdown-wrapper').appendChild(fragment)

    contraSlider = createSlider(0, 100, 0); // CONTRASTE
    contraSlider.id("contrast-slider")
    contraSlider.class("slider")
	fragment.appendChild(document.querySelector('#contrast-slider'))
	document.querySelector('#contrast-slider-container').appendChild(fragment)
    contraSliderP = createP(contraSlider.value())
    contraSliderP.id("contrast-slider-p")
    contraSliderP.class("slider-p")
	fragment.appendChild(document.querySelector('#contrast-slider-p'))
	document.querySelector('#contrast-slider-container').appendChild(fragment)

    brightSlider = createSlider(0, 100, 0); // BRILHO
    brightSlider.id("bright-slider")
    brightSlider.class("slider")
	fragment.appendChild(document.querySelector('#bright-slider'))
	document.querySelector('#brightness-slider-container').appendChild(fragment)
    brightSliderP = createP(brightSlider.value())
    brightSliderP.id("bright-slider-p")
    brightSliderP.class("slider-p")
	fragment.appendChild(document.querySelector('#bright-slider-p'))
	document.querySelector('#brightness-slider-container').appendChild(fragment)

    redSlider = createSlider(0, 2, 1, 0); // RED
    redSlider.id("R-slider")
    redSlider.class("slider")
	fragment.appendChild(document.querySelector('#R-slider'))
	document.querySelector('#R-slider-container').appendChild(fragment)
    redSliderP = createP(Math.floor(redSlider.value()*100))
    redSliderP.id("R-slider-p")
    redSliderP.class("slider-p")
	fragment.appendChild(document.querySelector('#R-slider-p'))
	document.querySelector('#R-slider-container').appendChild(fragment)

    greenSlider = createSlider(0, 2, 1, 0); // GREEN
    greenSlider.id("G-slider")
    greenSlider.class("slider")
	fragment.appendChild(document.querySelector('#G-slider'))
	document.querySelector('#G-slider-container').appendChild(fragment)
    greenSliderP = createP(Math.floor(greenSlider.value()*100))
    greenSliderP.id("G-slider-p")
    greenSliderP.class("slider-p")
	fragment.appendChild(document.querySelector('#G-slider-p'))
	document.querySelector('#G-slider-container').appendChild(fragment)

    blueSlider = createSlider(0, 2, 1, 0); // BLUE
    blueSlider.id("B-slider")
    blueSlider.class("slider")
	fragment.appendChild(document.querySelector('#B-slider'))
	document.querySelector('#B-slider-container').appendChild(fragment)
    blueSliderP = createP(Math.floor(blueSlider.value()*100))
    blueSliderP.id("B-slider-p")
    blueSliderP.class("slider-p")
	fragment.appendChild(document.querySelector('#B-slider-p'))
	document.querySelector('#B-slider-container').appendChild(fragment)
    
    hueSlider = createSlider(0, 1, 0, 0); // HUE
    hueSlider.id("hue-slider")
    hueSlider.class("slider")
	fragment.appendChild(document.querySelector('#hue-slider'))
	document.querySelector('#hue-slider-container').appendChild(fragment)
    hueSliderP = createP(Math.floor(hueSlider.value()*100))
    hueSliderP.id("hue-slider-p")
    hueSliderP.class("slider-p")
	fragment.appendChild(document.querySelector('#hue-slider-p'))
	document.querySelector('#hue-slider-container').appendChild(fragment)

    
    satuSlider = createSlider(-1, 1, 0, 0); // SATURATION
    satuSlider.id("saturation-slider")
    satuSlider.class("slider")
	fragment.appendChild(document.querySelector('#saturation-slider'))
	document.querySelector('#saturation-slider-container').appendChild(fragment)
    satuSliderP = createP(Math.floor(satuSlider.value()*100))
    satuSliderP.id("saturation-slider-p")
    satuSliderP.class("slider-p")
	fragment.appendChild(document.querySelector('#saturation-slider-p'))
	document.querySelector('#saturation-slider-container').appendChild(fragment)
    

}

function draw() {
    background(0)

    if(imgModified) image(imgModifiedlow, 0, 0, height, height)

    if(sourceR && sourceG && sourceB && !imgRGB) {
        margin = 30
        stroke(255)
        strokeWeight(3)
        noFill();
        rect(width/9,margin, height/3,height/3)
        rect(width/9+width/3+width/9,margin, height/3,height/3)
        rect(width/2-height/6, height/3+margin*2, height/3,height/3)
        image(sourceR, width/9,margin, height/3,height/3)
        image(sourceG, width/9+width/3+width/9,margin, height/3,height/3)
        image(sourceB, width/2-height/6, height/3+margin*2, height/3,height/3)
        textAlign(LEFT, TOP);
        textSize(40)
        fill(255)
        strokeWeight(1)
        text("R", width/9+5,margin+5)
        text("G", width/9+width/3+width/9+5,margin+5)
        text("B", width/2-height/6+5, height/3+margin*2+5)

        document.querySelector('#generateRGBImages-button').removeAttribute('disabled')
    }

    if(imgModified) {
        let contraValue = contraSlider.value();
        let brightValue = brightSlider.value();
        let redValue = redSlider.value();
        let greenValue = greenSlider.value();
        let blueValue = blueSlider.value();
        let hueValue = hueSlider.value();
        let satuValue = satuSlider.value();
        

        if(contraValue!=contraPrevious || brightValue!=brightPrevious || redValue!=redPrevious || greenValue!=greenPrevious || blueValue!=bluePrevious || hueValue!=huePrevious || satuValue!=satuPrevious){
            restoreImage()
            
            op_red(imgModifiedlow, redValue);
            op_green(imgModifiedlow, greenValue);
            op_blue(imgModifiedlow, blueValue);
            op_hue(imgModifiedlow, hueValue);
            op_hue(imgModifiedlow, 0, satuValue);
            op_contrast(imgModifiedlow, contraValue);
            op_brightness(imgModifiedlow, brightValue);

            contraSliderP.html(contraValue)
            brightSliderP.html(brightValue)
            redSliderP.html(Math.floor(redValue*100))
            greenSliderP.html(Math.floor(greenValue*100))
            blueSliderP.html(Math.floor(blueValue*100))
            hueSliderP.html(Math.floor(hueValue*100))
            satuSliderP.html(Math.floor(satuValue*100))

            contraPrevious = contraValue;
            brightPrevious = brightValue;
            redPrevious = redValue;
            greenPrevious = greenValue;
            bluePrevious = blueValue;
            huePrevious = hueValue;
            satuPrevious = satuValue;
        }
    }
}

const carregaImagem = (data) => {
    return new Promise((resolve, reject) => {
        img = loadImage(data)
        if(img) resolve(img)
    })
}

function handleFile(file) {
    if(file.type === 'image') {
        nome = file.name.split('-')
        type = nome[nome.length-1].split('.')[0]

        if(type == "raw") {
            img = createImg(file.data, '');
            img.id("img-raw")
            var fragment = document.createDocumentFragment()
            fragment.appendChild(document.querySelector('#img-raw'))
            document.querySelector('#raw-download-image').appendChild(fragment)
        }
        else {
            carregaImagem(file.data).then((img) => {
                if(type == "red")   sourceR   = img
                if(type == "green") sourceG   = img
                if(type == "blue")  sourceB   = img
            })
        }
    }
}

function montaRGB(sR, sG, sB) {
    if(sR.width == 1 || sG.width == 1 || sB.width == 1) return null;
    var imagem = createImage(1600, 1600)

    imagem.loadPixels()
    sR.loadPixels()
    sG.loadPixels()
    sB.loadPixels()
    for(let x = 0; x<1600; x++)
    for(let y = 0; y<1600; y++) {
        index = (1600 * y + x)*4
        imagem.pixels[index]   = sR.pixels[index]
        imagem.pixels[index+1] = sG.pixels[index]
        imagem.pixels[index+2] = sB.pixels[index]
        imagem.pixels[index+3] = 255
    }

    imagem.updatePixels()
    return imagem
}

function restoreImage() {
    imgModifiedlow.loadPixels()
    imgRGBlow.loadPixels()
    for(let index = 0; index < imgRGBlow.pixels.length; index++) 
        imgModifiedlow.pixels[index] = imgRGBlow.pixels[index]
    imgModifiedlow.updatePixels()
}

function copyImage(img) {
    if(img == null) return null
    newImg = createImage(img.width, img.height)
    img.loadPixels()
    newImg.loadPixels()
    for(let index = 0; index < img.pixels.length; index++) 
        newImg.pixels[index] = img.pixels[index]
    newImg.updatePixels()
    return newImg
}

function handleExample() {

}

function generateRGBImages() {
    
	document.querySelector('canvas').style.display = "block";
	document.querySelector('#generate-RGB-container').style.display = "none";

    button = createButton('Generate Unificated Image');
    button.id('unifed-btn')
    document.querySelector('main').appendChild(document.querySelector('#unifed-btn'))
    document.querySelector('#unifed-btn').setAttribute("onclick", "joinImages()")
}

function joinImages() {
    imgRGB = montaRGB(sourceR, sourceG, sourceB)
    imgModified = copyImage(imgRGB)

    var lowSize = 500
    imgRGBlow = createImage(lowSize, lowSize)
    imgRGBlow.copy(imgRGB, 0,0, 1600,1600, 0,0 , lowSize,lowSize)

    imgModifiedlow = createImage(lowSize, lowSize)
    imgModifiedlow.copy(imgRGB, 0,0, 1600,1600, 0,0 , lowSize,lowSize)
    
    document.querySelector('#unifed-btn').style.display = "none";
    document.querySelector('#download-btn').removeAttribute('disabled')
}

function downloadResult() {

    imgModified = copyImage(imgRGB)
    
    let contraValue = contraSlider.value();
    let brightValue = brightSlider.value();
    let redValue = redSlider.value();
    let greenValue = greenSlider.value();
    let blueValue = blueSlider.value();
    let hueValue = hueSlider.value();
    let satuValue = satuSlider.value();

    op_red(imgModified, redValue);
    op_green(imgModified, greenValue);
    op_blue(imgModified, blueValue);
    op_hue(imgModified, hueValue);
    op_hue(imgModified, 0, satuValue);
    op_contrast(imgModified, contraValue);
    op_brightness(imgModified, brightValue);

    imgModified.save('junocam_edited', 'png')
}
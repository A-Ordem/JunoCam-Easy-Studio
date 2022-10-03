
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

let selectedFile
let entries

let sR1
let sG1
let sB1
let sRAW1

let sR2
let sG2
let sB2
let sRAW2

let sR3
let sG3
let sB3
let sRAW3

function preload() {
    sR1 = loadImage("./images/examples/1r.png")
    sG1 = loadImage("./images/examples/1g.png")
    sB1 = loadImage("./images/examples/1b.png")
    sRAW1 = createImg("./images/examples/1raw.png")
    sRAW1.hide()
    
    sR2 = loadImage("./images/examples/2r.png")
    sG2 = loadImage("./images/examples/2g.png")
    sB2 = loadImage("./images/examples/2b.png")
    sRAW2 = createImg("./images/examples/2raw.png")
    sRAW2.hide()

    sR3 = loadImage("./images/examples/3r.png")
    sG3 = loadImage("./images/examples/3g.png")
    sB3 = loadImage("./images/examples/3b.png")
    sRAW3 = createImg("./images/examples/3raw.png")
    sRAW3.hide()
}

const model = (() => {

    return {
        getEntries(file, options) {
            return (new zip.ZipReader(new zip.BlobReader(file))).getEntries(options)
        },
        async getURL(entry, options) {
            return URL.createObjectURL(await entry.getData(new zip.BlobWriter(), options))
        }
    }

})()

function setup() {
    createCanvas(677, 677)

    var input = createFileInput(handleFile, "true")
    input.position(0, 0)
    input.id("input-btn")
    var fragment = document.createDocumentFragment()
	fragment.appendChild(document.querySelector('#input-btn'))
	document.querySelector('#input-btn-container').appendChild(fragment)

    const fileInput = document.querySelector('#input-btn')
    fileInput.onchange = selectFile

    async function selectFile() {
        try {
            selectedFile = fileInput.files[0]
            await loadFiles()
        } catch (error) {
            alert(error)
        }
    }

    async function loadFiles(filenameEncoding) {
        entries = await model.getEntries(selectedFile, { filenameEncoding })

    }
    document.querySelector('#input-btn').setAttribute("accept", ".zip,.rar,.7zip")

	document.querySelector('canvas').style.display = "none";
    
    sel = createSelect();
    sel.id("dropdown-examples")
    sel.option('Select');
    sel.option('7951-imageSet');
    sel.option('12633-imageSet');
    sel.option('13630-imageSet');
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
    entries.forEach( async  (entry, entryIndex) => {
        if (entry.filename.includes('raw')) {
            img = createImg(await model.getURL(entry, {}), '')
            img.id("img-raw")
            var fragment = document.createDocumentFragment()
            fragment.appendChild(document.querySelector('#img-raw'))
            document.querySelector('#raw-download-image').appendChild(fragment)

        } else {
            carregaImagem(await model.getURL(entry, {})).then((img) => {
                if(entry.filename.includes('red'))   sourceR   = img
                if(entry.filename.includes('green')) sourceG   = img
                if(entry.filename.includes('blue'))  sourceB   = img
            })
        }
    })
}

// function handleFile(file) {
//     if(file.type === 'image') {
//         nome = file.name.split('-')
//         type = nome[nome.length-1].split('.')[0]

//         if(type == "raw") {
//             img = createImg(file.data, '');
//             img.id("img-raw")
//             var fragment = document.createDocumentFragment()
//             fragment.appendChild(document.querySelector('#img-raw'))
//             document.querySelector('#raw-download-image').appendChild(fragment)
//         }
//         else {
//             carregaImagem(file.data).then((img) => {
//                 if(type == "red")   sourceR   = img
//                 if(type == "green") sourceG   = img
//                 if(type == "blue")  sourceB   = img
//             })
//         }
//     }
// }

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
    nome = sel.value() 

    if(sourceR) return
    
    if(nome == "7951-imageSet") {
        sourceR = sR1
        sourceG = sG1
        sourceB = sB1
        sourceRAW = sRAW1
    }
    if(nome == "12633-imageSet") {
        sourceR = sR2
        sourceG = sG2
        sourceB = sB2
        sourceRAW = sRAW2
    }
    if(nome == "13630-imageSet") {
        sourceR = sR3
        sourceG = sG3
        sourceB = sB3
        sourceRAW = sRAW3
    }
    
    if(sourceRAW) {
        sourceRAW.show()
        sourceRAW.id("img-raw")
        var fragment = document.createDocumentFragment()
        fragment.appendChild(document.querySelector('#img-raw'))
        document.querySelector('#raw-download-image').appendChild(fragment)
    }
    
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
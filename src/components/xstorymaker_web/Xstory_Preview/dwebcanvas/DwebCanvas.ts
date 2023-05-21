

export class DwebCanvas {
  context: CanvasRenderingContext2D | null;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  canvasDefaultBg:HTMLImageElement|null = null;
  constructor(option: { canvas: HTMLCanvasElement, width: number, height: number, canvasDefaultBg?:HTMLImageElement }) {
    this.canvas = option.canvas;
    this.context = this.canvas.getContext('2d');
    this.width = option.width;
    this.height = option.height;
    if (option.canvasDefaultBg) {
      this.canvasDefaultBg = option.canvasDefaultBg;
    }
    console.log('canvas init')
  }

  renderImage(image: HTMLImageElement, option?: { x: number, y: number, width?: number, height?: number }) {
    this.context!.save();
    if (option) {
      this.context!.translate(this.width / 2 + option.x, this.height / 2 + option.y);
      if (option.width && option.height) {
        this.context!.drawImage(image, -option.width / 2, -option.height / 2, option.width, option.height);
      }
    } else {
      this.context!.translate(this.width / 2, this.height / 2);
      this.context!.drawImage(image, -this.width / 2, -this.width / image.width * image.height / 2, this.width, this.width / image.width * image.height);
    }
    this.context!.restore();
  }

  drawFillRect(params:{x:number,y:number,width:number,height:number,color:string}){
    this.context?.save();
    this.context?.translate(this.width / 2, this.height / 2);
    this.context!.fillStyle = params.color;
    this.context?.fillRect(params.x,params.y,params.width,params.height);
    this.context?.fill();
    this.context?.restore();
  } 

  drawText(params:{text:string,x:number,y:number,color:string,fontSize:number}){
    const textArr = params.text.split('\n');

    this.context?.save();
    this.context?.translate(this.width / 2, this.height / 2);
    this.context!.fillStyle = params.color;
    this.context!.font = `${params.fontSize}px Arial`;
    this.context!.textAlign = 'center';
    this.context!.textBaseline = 'top';

    textArr.forEach((item,index)=>{
      this.context?.fillText(item,params.x,params.y+params.fontSize*index);
    })

    this.context?.restore();
  }

  renderXstoryScriptList(list:({ type: 'image'; image: HTMLImageElement | null; imagePos: { x: number; y: number; dir: string; }; scale: number; } | { type: 'text'; text: string; })[]){
    
    list.forEach((item,index)=>{
      if (item.type=='image') {
        if (item.imagePos.dir=='left') {
          this.renderImage(item.image!,{x:item.imagePos.x-this.width/4,y:item.imagePos.y,width:this.width/2*0.75*item.scale,height:this.width/2*0.75/item.image!.width*item.image!.height*item.scale})
        }else{
          this.renderImage(item.image!,{x:item.imagePos.x+this.width/4,y:item.imagePos.y,width:this.width/2*0.75*item.scale,height:this.width/2*0.75/item.image!.width*item.image!.height*item.scale})
        }
      }

      if (item.type=='text') {
        this.drawFillRect({x:-this.width/2,y:this.height/2*0.25,width:this.width,height:this.height/2*0.75,color:'#00000080'})
        this.drawText({text:item.text,x:0,y:this.height*0.25,color:'#ffffff',fontSize:14})
      }
    })
    
  }

  clearCanvas() {
    this.context?.clearRect(0, 0, this.width, this.height);
    if (this.canvasDefaultBg) {
      this.context?.save();
      this.context?.translate(this.width / 2, this.height / 2);
      this.context?.drawImage(this.canvasDefaultBg, -this.width / 2, -this.width / this.canvasDefaultBg.width * this.canvasDefaultBg.height / 2, this.width, this.width / this.canvasDefaultBg.width * this.canvasDefaultBg.height);
      this.context?.restore();
    }
  }


}
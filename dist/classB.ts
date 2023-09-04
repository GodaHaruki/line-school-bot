class ClassB extends ClassA<number> {
  constructor(v: number){
    super(v)
  }
}

function initClassB(){
  new ClassB(0)
}

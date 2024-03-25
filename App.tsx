import React, {Component} from 'react'
import {StyleSheet, Text, View, ScrollView, TouchableHighlightBase} from 'react-native'
import Button from './src/components/Button'
import Display from './src/components/Display'


//Constante que define o estado inicial da aplicação
const initialState = {

  //displayValue será exibido no display do valor da operação
  displayValue: '0',

  //clearDisplay será a verificação de quando o display do valor da operação precisa limpar
  clearDisplay: false,

  //A operação inserida no decorrer da aplicação
  operation: null,

  //O primeiro e segundo valor da operação que será realizada
  values: [0, 0],

  //O valor do índice referente o array values
  current: 0,

  //O display superior que acumula as operação realizadas anteriormente
  displayMemory: '',

  //verifica qual saída será utilizada
  outputIndex: 0,
  
  //verifica se a entrada é do tipo operação: ( + - / * =) alterando para true
  operationBool: false,

  //verifica se a operação digitada foi ( = )
  equalBool: false, 

}


export default class App extends Component{

  //cria um clone do objeto initialStade no escopo da classe App
  state = {...initialState}

  addDigit = (n: string | number) => {

     //cria a constante local para verificar atribuir o estado do display
    const clearDisplay = this.state.displayValue === '0' || this.state.clearDisplay
   
    //verifica se já foi digitado ponto
    if(n === '.' && this.state.displayValue.toString().includes('.') && !clearDisplay){
        return 
    } 
    
     
    //cria a constante local e guardar o valor que está no display como string
    const currentValue = clearDisplay ? '' : this.state.displayValue
   
    //cria a constante local e guardar o valor que está no display + o valor digitado, concatenando as duas strings como string
    const displayValue = currentValue + n 

            
    
    //Se o usuário realizou uma operação e não deseja realizar outra operação com o resultado 
    //os displays exibirão o valor digitado
    if(this.state.values[1] === 0 && this.state.outputIndex === 1 && n !== '.'){
      this.setState({displayValue, clearDisplay: false, displayMemory:n }) 
    }else{
      //Se o usuário realizou uma operação e deseja realizar outra operação com o resultado 
      //O display de valor exibirá o valor digitado atual
      //E o display de memória exibirá todo histórico anterior + o digitado
      this.setState({displayValue, clearDisplay: false, displayMemory: '' + this.state.displayMemory + n })
    } 
   
     //se o display valor for zer o display de memória não acumula zeros
     if(n === 0 && this.state.displayValue === '0'){
      this.setState({displayMemory: ''})
    }
    //Acrescenta o zero quando foir inserido . o display for zero: Anterior: . - Atual 0.
    if(n === '.' && this.state.values[this.state.current].toString() === '0'){
      this.setState({displayMemory: this.state.displayMemory + '0.', displayValue: '0.'})
    }
  
      if(n !== '.'){
      //transforma o valor digitado atual String em Float e guarda na constante  
      const newValue = parseFloat(displayValue)
      //Cria clone dos arrays de states de escopo local
      const values = [...this.state.values]
      //Gaurda o valor anteriormente convertido em float no array de escopo local na posição atual (1º ou 2º valor da operação)
      values [this.state.current] = newValue
      //Guarda os valores no array do state de escopo global
      this.setState({ values })
    }   

    //Para que o sistema saiba se a ultima entrada não foi de operação, ou seja: + - * / =
    this.setState({operationBool: false})   
    this.setState({equalBool: false})

    

   
        
  }

  //Limpa aplicação recurando seu estado inicial
  clearMemory = () => {
    this.setState({...initialState})
  }

  //É chamada quando é inserida alguma das operações: ( + - / * = )
  setOperation = (operation: string | null) => {     
    if(this.state.values[1] === 0 && operation === '='){
          return
      }
    //Impede que a operação igual seja digitada duas vezes
    if(this.state.equalBool === false || operation !== '='){

      //Se a ultima entrada foi do tipo operação
      if(this.state.operationBool === false){
        //Altera o status da operação para verdadeiro
        //Pois se o usuário digitar duas operações seguidas irá ser jogado para o else da condição if(this.state.operationBool === false) 
        //Retorna o valor de saída para zero, caso o usuário acumule operações sem reiniciar o status
        this.setState({operationBool: true, outputIndex: 0})

        //O display de memória só armazenará a operação caso o array de valores esteja diferente de zero
        if(this.state.values[0] !== 0 || this.state.values[1]!== 0){
          this.setState({displayMemory: this.state.displayMemory + ' ' + operation + ' '}) 
        }
         
        //verifica se foram digitadas ao menos duas operações
        //Exemplo entrada: 1 + 2 = 3. O this.state.operation é "+" e o operation é "="  
        //Outro exemplo : 1 + 1 - 1 = O this.state.operation é "+" e o operation é "-"    
        if(this.state.operation !== null && operation !== null){    
         
        //Executa a operação matemática transformando em float e toFixed(9) corrige o problema de operações com decimais
        //É realizada a operação entre as duas posições do array e o resultado armazenado no índice 0 
        this.state.values[0] =  parseFloat(eval(`${this.state.values[0]} ${this.state.operation} ${this.state.values[1]}`).toFixed(9)) 

          //Caso a ultima operação digitada foi =
          //Exemplo: 1 + 2 = 3
          if(operation === '=' && this.state.equalBool === false){       
          
            //corrige o problema de aceitar duas vezes a operação igual 
          this.setState({equalBool: true})
          
          //Devido a operação "=" não ser aceita na função eval, após realizar a operação anterior e exibir o resultado
          //permite que seja realizada outra operação com o resultado, acumulando operações após o igual
          this.setState({operationBool: false})
          
          //Atualizada o status dos objetos e o display de valor com o resultado da ultima operação
          //O estado da constante operation GLOBAL não será alterada
          //Caso o objeto guardasse a operação "=" a função eval daria erro
          this.setState({current: 1, operation: null, clearDisplay: true, displayValue: this.state.values[0] })  
          
          //atualiza o display de memória acumulando os valores digitados mais a ultima operação
          this.setState({displayMemory: this.state.displayMemory + ' ' + operation + ' ' + this.state.values[0]}) 
                   
          //informa que a saída decorreu da operação igual
          this.setState({outputIndex: 1})

          //Zera o array no índice 1, visto que o resultado da operação está no índice 0          
          this.state.values[1] = 0 
           
          
          // Caso a segunda operação realizada não seja igual, a aplicação ralizada a operação cumulativa
          }else{           
                         
              this.setState({current: 1, operation,  clearDisplay: true, displayValue: this.state.values[0]})    
              
              //Display de memória com o " = " após duas operações:
             // this.setState({displayMemory: this.state.displayMemory + ' ' + '=' + ' ' + this.state.values[0] + ' ' + operation + ' '}) 
            
            
              //Display de memória sem escrever o " = " após duas operações:
              this.setState({displayMemory: this.state.displayMemory + ' ' + operation + ' '})             
              
              //A saída dois indica que o usuário realizou uma operação e com o resultado deseja realizar outra operação
              this.setState({outputIndex: 2})     
           
           
           }
                
        
        }else{
          
          this.setState({current: 1, operation,  clearDisplay: true}) 
        }     
        
      }                 
         
    }
  }

  
  render(){
    return(      
      <View style={styles.container}>
        <Display value={this.state.displayValue}></Display>
        <View style={styles.buttons}>
          <Button label='AC' double onClick={this.clearMemory}/>
          <Button label='/' operation onClick={() => this.setOperation('/')}/>
          <Button label='7' onClick={() => this.addDigit(7)} />
          <Button label='8' onClick={() => this.addDigit(8)}/> 
          <Button label='9' onClick={() => this.addDigit(9)}/>
          <Button label='*' operation onClick={() => this.setOperation('*')}/>
          <Button label='4' onClick={() => this.addDigit(4)}/>
          <Button label='5' onClick={() => this.addDigit(5)}/>
          <Button label='6' onClick={() => this.addDigit(6)}/>
          <Button label='-' operation onClick={() => this.setOperation('-')}/>
          <Button label='1' onClick={() => this.addDigit(1)}/>
          <Button label='2' onClick={() => this.addDigit(2)}/>
          <Button label='3' onClick={() => this.addDigit(3)}/>
          <Button label='+' operation onClick={() => this.setOperation('+')}/>
          <Button label='0' double onClick={() => this.addDigit(0)}/>
          <Button label='.'onClick={() => this.addDigit('.')}/>
          <Button label='='operation onClick={() => this.setOperation('=')}/>
        </View>
      </View>
    );

  }


} 

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },

  buttons:{
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
  
    
})
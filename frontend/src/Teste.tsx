import { useState} from "react"
import { ENV } from "./config/env.ts"

function Teste() {

  const [mensagem, setMensagem] = useState("Bom dia")
  const [inputValor, setInputValor] = useState("")

  async function chamarBackend(){
    try {
      const response = await fetch(`${ENV.VITE_API_BACKEND_URL}/api/v1/teste/mudar`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: inputValor }),
      })

      const dados = await response.json()
      setMensagem(dados.resposta)

    } catch (erro) {
      console.error("Erro ao comunicar com o backend:", erro)
      setMensagem("Erro de comunicação")
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold mt-6 text-6xl ">
          {mensagem}
        </h1>

        <input  className="border w-3xs" 
                type="text" 
                placeholder="Insira a mensagem a ser substituida"
                value={inputValor}
                onChange={(e) => setInputValor(e.target.value)}/>
                
      
        <button 
          className="border-2 m-5 p-5 rounded-2xl bg-green-300 font-bold hover:bg-green-400 active:bg-green-200 cursor-pointer" 
          onClick={chamarBackend}
        >
          Enviar
        </button>
      </div>
    </>
  )
}

export default Teste
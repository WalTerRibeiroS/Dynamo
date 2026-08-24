import { useState} from "react"
import { ENV } from "./config/env.ts"
import type { ApiResponse } from "./types/apiResponse.ts"

function Teste() {

  const [mensagem, setMensagem] = useState("Bom dia")
  const [inputValor, setInputValor] = useState("")
  const [erroMensagem, setErroMensagem] = useState("")

  async function chamarBackend(){
    try {
      const response = await fetch(`${ENV.VITE_API_BACKEND_URL}/api/v1/teste/mudar`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensagem: inputValor }),
      })

      const dados: ApiResponse<{ resposta: string }> = await response.json()
      
      if(dados.success === false){
        let mensagemErroFinal = dados.message

        if(dados.issues && dados.issues.length > 0){
          const detalhesIssues = dados.issues
            .map(issue => `${issue.field || 'Campo'}: ${issue.message}`)
            .join(', ')

            mensagemErroFinal += `.Detalhes: ${detalhesIssues}`
        }
        setErroMensagem(mensagemErroFinal);
        return
      }

      setMensagem(dados.data.resposta)

    } catch (erro) {
      console.error("Erro ao comunicar com o backend:", erro)
      setMensagem("Erro de comunicação. Tente novamente mais tarde")
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
          onClick={chamarBackend}>
          Enviar
        </button>
        <span>{erroMensagem}</span>
      </div>
    </>
  )
}

export default Teste
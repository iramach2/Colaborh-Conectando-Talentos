const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'CompanyDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Vamos definir o padrão exato a ser encontrado e substituído
const target = `                                              transition={{ duration: 0.8, ease: "easeOut" }}


                  {/* Modal Footer */}`;

const replacement = `                                              transition={{ duration: 0.8, ease: "easeOut" }}
                                              className={\`h-full rounded-[3px] \${style.color}\`} 
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}

                            {activeTemperamentosTab === 'AUDITORIA' && (
                              <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-left mb-4">
                                  Auditoria Detalhada de Respostas (25 Questões)
                                </h3>

                                <div className="space-y-4">
                                  {TEMPERAMENTOS_QUESTIONS.map((question) => {
                                    const answer = answers.find((ans: any) => ans.q === question.id);
                                    const selectedChoice = answer ? answer.choice : '';

                                    return (
                                      <div 
                                        key={question.id} 
                                        className="bg-white p-5 rounded-[5px] border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-all text-left"
                                      >
                                        <div className="flex items-start gap-3">
                                          <span className="flex items-center justify-center w-6 h-6 rounded-[5px] text-[10px] font-black shrink-0 text-white bg-sky-600">
                                            {question.id}
                                          </span>
                                          <h4 className="text-xs font-bold text-slate-800 leading-normal pt-0.5">
                                            {question.text}
                                          </h4>
                                        </div>

                                        {/* As 4 opções renderizadas */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-9">
                                          {Object.entries(question.options).map(([profileKey, optionText]) => {
                                            const isSelected = selectedChoice === profileKey;
                                            const profileName = profileKey === 'I' ? 'Idealista (I)' : profileKey === 'C' ? 'Comunicador (C)' : profileKey === 'O' ? 'Organizador (O)' : 'Executor (A)';
                                            
                                            // Colors mapping based on the profile style
                                            let bgClass = 'bg-white border-slate-100 text-slate-500';
                                            if (isSelected) {
                                              if (profileKey === 'I') bgClass = 'bg-sky-50/80 border-sky-300 text-sky-900 shadow-2xs font-bold';
                                              else if (profileKey === 'C') bgClass = 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-2xs font-bold';
                                              else if (profileKey === 'O') bgClass = 'bg-violet-50/80 border-violet-300 text-violet-900 shadow-2xs font-bold';
                                              else if (profileKey === 'A') bgClass = 'bg-rose-50/80 border-rose-300 text-rose-900 shadow-2xs font-bold';
                                            }

                                            return (
                                              <div 
                                                key={profileKey} 
                                                className={\`p-3 rounded-[5px] border transition-all text-[11px] leading-relaxed flex flex-col justify-between gap-1.5 \${bgClass}\`}
                                              >
                                                <div className="flex justify-between items-start gap-2">
                                                  <span>{optionText}</span>
                                                  <span className={\`text-[7px] px-1 py-0.2 rounded-[5px] font-black shrink-0 \${
                                                    profileKey === 'I' ? 'bg-sky-100 text-sky-700' :
                                                    profileKey === 'C' ? 'bg-emerald-100 text-emerald-700' :
                                                    profileKey === 'O' ? 'bg-violet-100 text-violet-700' :
                                                    'bg-rose-100 text-rose-700'
                                                  }\`}>
                                                    {profileKey}
                                                  </span>
                                                </div>
                                                {isSelected && (
                                                  <div className="text-[9px] pt-1.5 border-t border-slate-100/50 font-black uppercase tracking-wider text-slate-400">
                                                    ✓ Escolha do Candidato ({profileName})
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>

                  {/* Modal Footer */}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('TEMPERAMENTOS RESTAURADO COM SUCESSO!');
} else {
  console.log('Alvo não encontrado! Verificando quebra de linha alternativa...');
  // Vamos tentar com \r\n se for Windows
  const targetCRLF = target.replace(/\n/g, '\r\n');
  const replacementCRLF = replacement.replace(/\n/g, '\r\n');
  if (content.includes(targetCRLF)) {
    content = content.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('TEMPERAMENTOS RESTAURADO COM SUCESSO (CRLF)!');
  } else {
    console.log('Alvo ainda não encontrado. O arquivo pode ter mudado ligeiramente.');
  }
}

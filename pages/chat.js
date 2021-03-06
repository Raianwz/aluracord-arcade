import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import React from 'react';
import appConfig from '../config.json';

const SUPABASE_ANON_KEY = `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
const SUPABASE_URL = `https://${process.env.NEXT_PUBLIC_SUPABASE_URL}.supabase.co/`;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function messagesListinerRealTime(addMessage) {
    return supabaseClient.from('mensagens')
        .on('INSERT', (liveResp) => { addMessage(liveResp.new); })
        .subscribe();
}



export default function CharArcade() {
    const [mensagem, setMensagem] = React.useState('');
    const [listMessages, setListMessages] = React.useState([]);
    const router = useRouter();
    const { username } = router.query;

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                //console.log('Dados da consulta:', data);
                setListMessages(data);
            });
    }, []);

    const subscription = messagesListinerRealTime((newMessage) => {
        console.log('Nova mensagem:', newMessage);
        console.log('listaDeMensagens', listMessages);

        setListMessages((valorAtualDaLista) => {
            console.log('Valor Atual:', valorAtualDaLista);
            return [
                newMessage,
                ...valorAtualDaLista,
            ]
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function handleNewMessage(newMessage) {
        const mensagem = {
            de: username,
            texto: newMessage,
        };
        supabaseClient
            .from('mensagens')
            .insert([mensagem])
            .then(({ data }) => {
                console.log(`Criando mensagem: ${data[0]}`);
            });
        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://wallpaperaccess.com/full/782955.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listMessages} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(e) => {
                                const valor = e.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleNewMessage(mensagem)
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(':sticker:' + sticker);
                            }}
                        />
                        <Button
                            onClick={(e)=>{
                                e.preventDefault()
                                if(mensagem.length !== 0 && mensagem.trim() !== ''){
                                    handleNewMessage(mensagem)
                                }
                            }}
                            buttonColors={{
                                contrastColor: `${appConfig.theme.colors.primary[500]}`,
                                mainColor: `${appConfig.theme.colors.neutrals[800]}`,
                                mainColorLight: `${appConfig.theme.colors.neutrals[400]}`,
                                mainColorStrong: `${appConfig.theme.colors.neutrals[900]}`
                              }}
                            styleSheet={{
                                borderRadius: '50%',
                                padding: '0 3px 0 0',
                                marginLeft: '10px',
                                minWidth: '50px',
                                minHeight: '50px',
                                fontSize: '20px',
                                marginBottom: '8px',
                                lineHeight: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            iconName="FaTelegramPlane"

                            />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens?.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image styleSheet={{
                                    maxWidth: '250px',
                                    maxHeight: '250px'
                                }} src={mensagem.texto.replace(':sticker:', '')} />
                            )
                            : (
                                mensagem.texto
                            )
                        }

                        {/* {mensagem.texto} */}
                    </Text>
                )
            })}
        </Box>
    )
}
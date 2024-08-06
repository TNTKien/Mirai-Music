import { ApplicationCommandOptionType } from "seyfert/lib/types/index.js";

import type { DefaultLocale } from "seyfert";

export default {
  metadata: {
    name: "Spanish",
    emoji: "🇲🇽",
    traslators: ["MARCROCK22"],
  },
  messages: {
    commands: {
      setprefix: ({ prefix }) =>
        `\`✅\` El **nuevo prefijo** para este servidor es: \`${prefix}\``,
      skip: ({ amount }) =>
        `\`✅\` Saltando la cantidad de: \`${amount} canciones\`.`,
      move: ({ textId, voiceId }) =>
        `\`✅\` Me movi al canal de voz <#${voiceId}> y canal de texto: ${textId}`,
      previous: ({ title, uri }) =>
        `\`✅\` La canción anterior [**${title}**](${uri}) ha sido añadida a la cola.`,
      stop: "`👋` Deteniendo y abandonando el canal...",
      default: {
        engine: ({ engine }) =>
          `\`✅\` El tipo de búsqueda por defecto de Mirai ahora es: **${engine}**.`,
        volume: ({ volume }) =>
          `\`✅\` El volumen por defecto de Mirai ahora es: **${volume}%**.`,
      },
      setlocale: {
        invalidLocale: ({ locale, available }) =>
          `\`❌\` El idioma : \`${locale}\` es inválido.\n\`📢\` **Idiomas disponibles**: \`${available}\``,
        newLocale: ({ locale }) =>
          `\`✅\` El idioma de **Mirai** ahora es: \`${locale}\``,
      },
      ping: {
        message: "`🪶` Calculando...",
        response: ({ wsPing, clientPing, shardPing }) =>
          `\`🌐\` Pong! (**Cliente**: \`${wsPing}ms\` - **API**: \`${clientPing}ms\` - **Fragmento**: \`${shardPing}ms\`)`,
      },
      play: {
        undetermined: "Indeterminado",
        live: "🔴 EN DIRECTO",
        noResults:
          "`❌` **Sin resultados** para esta búsqueda...\n`🪶` Intenta buscando otra cosa.",
        autocomplete: {
          noNodes: "Mirai - No estoy conectada a ninguno de mis nodos.",
          noVoiceChannel:
            "Mirai - No estás en un canal de voz... Únete a uno para reproducir música.",
          noSameVoice: "Mirai - No estás en el mismo canal de voz que yo.",
          noQuery: "Mirai - Introduce el nombre o el URL para reproducir.",
          noTracks:
            "Mirai - No encontre la canción. Introduce otro nombre o el URL.",
        },
        embed: {
          playlist: ({ playlist, tracks, volume, query, requester }) =>
            `\`🎵\` La lista de canciones [\`${playlist}\`](${query}) ha sido añadida a la cola.\n\n\`🔊\` **Volumen**: \`${volume}%\`\n\`👤\` **Solicitada por**: <@${requester}>\n\`🔰\` **Con**: \`${tracks} canciones\``,
          result: ({ title, url, duration, volume, requester }) =>
            `\`🎵\` Añadida [\`${title}\`](${url}) a la cola.\n\n\`🕛\` **Duración**: \`${duration}\`\n\`🔊\` **Volumen**: \`${volume}%\`\n\`👤\` **Solicitada por**: <@${requester}>`,
          results: ({ title, url, duration, volume, requester, position }) =>
            `\`🎵\` Añadida [\`${title}\`](${url}) a la cola.\n\n\`🕛\` **Duración**: \`${duration}\`\n\`🔊\` **Volumen**: \`${volume}%\`\n\`👤\` **Solicitada por**: <@${requester}>\n\n\`📋\` **Posición en la cola**: \`#${position}\``,
        },
      },
      loop: {
        toggled: ({ type }) =>
          `\`✅\` El **modo de bucle** ahora es: \`${type}\``,
        loopType: {
          off: "Desactivado",
          queue: "Cola",
          track: "Canción",
        },
      },
      autoplay: {
        toggled: ({ type }) =>
          `\`✅\` El modo de la **reproducción automática** ahora es: \`${type}\``,
        autoplayType: {
          enabled: "Activado",
          disabled: "Desactivado",
        },
      },
      nodes: {
        value: ({ state, uptime, players }) =>
          `\`📘\` Estado: \`${state}\`\n\`🕛\` Tiempo de actividad: \`${uptime}\`\n\`🎤\` Reproductores: \`${players}\``,
        description: "`📋` Lista de los nodos de Mirai.",
        noNodes: "`❌` No hay nodos disponibles por el momento.",
        states: {
          connected: "🟢 Conectado.",
          disconnected: "🔴 Desconectado.",
        },
      },
      volume: {
        changed: ({ volume }) =>
          `\`✅\` El volumen ha sido establecido a: **${volume}%**.`,
        paused:
          "`🔰` El volumen es **1%**, así que el reproductor ha sido pausado.",
      },
      seek: {
        invalidTime: ({ time }) => `\`❌\` El tiempo \`${time}\` no es válido.`,
        seeked: ({ time, type }) =>
          `\`✅\` La canción ha sido **${type}** hacia \`${time}\`.`,
        exeedsTime: ({ time }) =>
          `\`❌\` El tiempo \`${time}\` excede la duración de la canción actual.`,
        noSeekable: "`❌` La **canción actual** no es `adelantable`.",
        type: {
          seeked: "adelantada",
          rewond: "devuelta",
        },
      },
    },
    events: {
      inCooldown: ({ time }) =>
        `\`❌\` Necesitas esperar: <t:${time}:R> (<t:${time}:t>) para usar esto.`,
      noSameVoice: ({ channelId }) =>
        `\`❌\` No estás en el **mismo canal de voz** que yo. (<#${channelId}>)`,
      noCollector: ({ userId }) =>
        `\`❌\` Solo el usuario: <@${userId}> puede usar esto.`,
      invalidOptions: ({ options, list }) =>
        `\`❌\` Opciones o argumentos del comando inválidos.\n- **Requerido**: \`<>\`\n- **Opcional**: \`[]\`\n\n\`📋\` **Uso**:\n ${options}\n\`📢\` **Opciones Disponibles**:\n${list}`,
      playerQueue: ({ tracks }) =>
        `\`📋\` Aquí está la cola completa del servidor: \n\n${tracks}`,
      channelEmpty: ({ type }) =>
        `\`🎧\` Mirai está sola en el **canal de voz**... Pausando y esperando **${type}**.`,
      noMembers:
        "`🎧` Mirai está sola en el **canal de voz**... Abandonando el canal.",
      hasMembers: "`🎧` Mirai dejó de estar sola... Resumiendo.",
      onlyDeveloper: "`❌` Solo el **dueño del bot** puede usar esto.",
      onlyGuildOwner: "`❌` Solo el **dueño del servidor** puede usar esto.",
      noVoiceChannel:
        "`❌` No estás en un **canal de voz**... Únete a uno para reproducir música.",
      noNodes: "`❌` No estoy conectada a ninguno de mis nodos.",
      noPlayer: "`❌` No estoy reproduciendo nada ahora mismo...",
      noPrevious: "`❌` No hubo una canción antes de esta.",
      noTracks: "`❌` No hay más canciones en la cola.",
      playerEnd: "`🔰` La cola ha terminado... Esperando más canciones.",
      moreTracks:
        "`❌` Para habilitar **esto** `una o más canciones` son requeridas.",
      commandError:
        "`❌` Algo inesperado ocurrió durante la ejecución del comando.\n`📢` Si el problema persiste, reporta el problema.",
      optionTypes: {
        [ApplicationCommandOptionType.Subcommand]: "subcomando",
        [ApplicationCommandOptionType.SubcommandGroup]: "grupo de subcomando",
        [ApplicationCommandOptionType.String]: "texto",
        [ApplicationCommandOptionType.Integer]: "entero",
        [ApplicationCommandOptionType.Boolean]: "booleano",
        [ApplicationCommandOptionType.User]: "@usuario",
        [ApplicationCommandOptionType.Channel]: "#canal",
        [ApplicationCommandOptionType.Role]: "@rol",
        [ApplicationCommandOptionType.Mentionable]: "@mencionable",
        [ApplicationCommandOptionType.Number]: "numero",
        [ApplicationCommandOptionType.Attachment]: "achivo",
      },
      playerStart: {
        embed: ({ duration, requester, title, url, volume, author, size }) =>
          `\`📻\` Reproduciendo ahora [\`${title}\`](${url})\n\n\`🎤\` **Autor**: \`${author}\`\n\`🕛\` **Duración**: \`${duration}\`\n\`🔊\` **Volumen**: \`${volume}%\`\n\`👤\` **Solicitado por**: <@${requester}>\n\n\`📋\` **En cola**: \`${size} canciones\``,
        components: {
          loop: ({ type }) => `Bucle: ${type}`,
          autoplay: ({ type }) => `Aleatorio: ${type}`,
          stop: "Parar",
          skip: "Saltar",
          previous: "Anterior",
          queue: "Cola",
          paused: {
            resume: "Resumir",
            pause: "Pausar",
          },
        },
      },
      permissions: {
        list: {
          AddReactions: "Añadir Reacciones",
          Administrator: "Administrador",
          AttachFiles: "Adjuntar Archivos",
          BanMembers: "Vetar Miembros",
          ChangeNickname: "Cambiar Apodo",
          Connect: "Conectar",
          CreateInstantInvite: "Crear Invitaciones",
          CreatePrivateThreads: "Crear Hilos Privados",
          CreatePublicThreads: "Crear Hilos Públicos",
          DeafenMembers: "Ensordecer Miembros",
          EmbedLinks: "Adjuntar Links",
          KickMembers: "Expulsar Miembros",
          ManageChannels: "Gestionar Canales",
          ManageEmojisAndStickers: "Gestionar Stickers y Emojis",
          ManageEvents: "Gestionar Eventos",
          ManageGuild: "Gestionar Servidor",
          ManageMessages: "Gestionar Mensajes",
          ManageNicknames: "Gestionar Apodos",
          ManageRoles: "Gestionar Roles",
          ManageThreads: "Gestionar Hilos",
          ManageWebhooks: "Gestionar Webhooks",
          MentionEveryone: "Mencionar a Todos",
          ModerateMembers: "Moderar Miembros",
          MoveMembers: "Mover Miembros",
          MuteMembers: "Silenciar Miembros",
          PrioritySpeaker: "Prioridad al Hablar",
          ReadMessageHistory: "Leer Historial de Mensajes",
          RequestToSpeak: "Solicitar Hablar",
          SendMessages: "Enviar Mensajes",
          SendMessagesInThreads: "Enviar Mensajes en Hilo",
          SendTTSMessages: "Enviar Mensajes TTS",
          Speak: "Hablar",
          Stream: "Transmitir",
          UseApplicationCommands: "Usar Comandos de Aplicaciones",
          UseEmbeddedActivities: "Usar Actividades Embebidas",
          UseExternalEmojis: "Usar Emojis Externos",
          UseExternalStickers: "Usar Stickers Externos",
          UseVAD: "Usar Detección De Voz",
          ViewAuditLog: "Ver Registro de Auditoría",
          ViewChannel: "Ver Canal",
          ViewGuildInsights: "Ver Información del Servidor",
          ManageGuildExpressions: "Gestionar Expresiones del Servidor",
          ViewCreatorMonetizationAnalytics:
            "Ver Análisis de Monetización de Creadores",
          UseSoundboard: "Usar Tablero de Sonidos",
          UseExternalSounds: "Usar Sonidos Externos",
          SendVoiceMessages: "Enviar Mensajes de Voz",
          CreateEvents: "Crear Eventos",
          CreateGuildExpressions: "Crear Expresiones del Servidor",
          SendPolls: "Enviar Encuestas",
          UseExternalApps: "Usar Aplicaciones Externas",
        },
        user: {
          description: "`📢` ¡Oye! Te faltan algunos permisos para hacer esto.",
          field: "`📋` Permisos Faltantes",
        },
        bot: {
          description: "`📢` ¡Oye! Me faltan algunos permisos para hacer esto.",
          field: "`📋` Permisos Faltantes",
        },
      },
    },
  },
  locales: {
    play: {
      name: "reproducir",
      description: "Reproduce música con Mirai.",
      option: {
        name: "nombre",
        description: "Introduce el URL o nombre de la canción.",
      },
    },
    ping: {
      name: "latencia",
      description: "Obten la latencia de Mirai.",
    },
    nodes: {
      name: "nodos",
      description: "Obten el estado de todos los nodos de Mirai.",
    },
    setlocale: {
      name: "idioma",
      description: "Establece el idioma de Mirai.",
      option: {
        name: "idioma",
        description: "Introduce el nuevo idioma.",
      },
    },
    autoplay: {
      name: "aleatoria",
      description: "Alterna la reproducción automática.",
    },
    volume: {
      name: "volumen",
      description: "Modifica el volumen.",
      option: {
        name: "volumen",
        description: "Introduce el volumen.",
      },
    },
    loop: {
      name: "bucle",
      description: "Alterna el modo de bucle.",
      option: {
        name: "modo",
        description: "Selecciona el modo de bucle.",
      },
    },
    move: {
      name: "mover",
      description: "Mover el reproductor.",
      options: {
        voice: {
          name: "voz",
          description: "Selecciona el canal.",
        },
        text: {
          name: "texto",
          description: "Selecciona el canal",
        },
      },
    },
    stop: {
      name: "detener",
      description: "Detiene el reproductor.",
    },
    skip: {
      name: "saltar",
      description: "Salta la canción actual.",
      option: {
        to: {
          name: "cantidad",
          description: "Salta una cantidad especifica de canciones.",
        },
      },
    },
    queue: {
      name: "cola",
      description: "Mira la cola de reproducción.",
    },
    seek: {
      name: "adelantar",
      description: "Adelantar la canción actual.",
      option: {
        name: "tiempo",
        description: "Introduce el tiempo. (Ej: 2min)",
      },
    },
    setprefix: {
      name: "prefijo",
      description: "Establece el prefijo de Mirai.",
      option: {
        name: "prefijo",
        description: "Introduce el prefijo nuevo.",
      },
    },
    default: {
      name: "defecto",
      description: "Cambia los ajustes por defecto de Mirai.",
      subcommands: {
        engine: {
          name: "busqueda",
          description: "Cambia el modo de búsqueda.",
          option: {
            name: "tipo",
            description: "Selecciona el tipo.",
          },
        },
        volume: {
          name: "volumen",
          description: "Cambia el volumen por defecto.",
        },
      },
    },
  },
} satisfies DefaultLocale;

import React, { useRef } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const EmojiOverlay = ({onSelectEmoji}:any) => {
    const emojiOverlay = useRef<any>(null);

    return (
        <>
            <button  onClick={(e) => emojiOverlay.current.toggle(e)}  className="text-gray-400 hover:text-gray-600">
                <Smile size={18} />
            </button>
            <OverlayPanel ref={emojiOverlay}>
                <EmojiPicker reactionsDefaultOpen={false} 
                onReactionClick={(reactData:any)=>{console.log("reactData", reactData)}}
                onEmojiClick={(data)=>{onSelectEmoji(data.emoji) }} height={500} width={400} />
            </OverlayPanel>
        </>
    )
}

export { EmojiOverlay }
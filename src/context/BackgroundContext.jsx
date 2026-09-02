import { createContext, useContext, useState, useEffect } from 'react'
import { useTheme } from './ThemeContext'

const BackgroundContext = createContext()

const backgrounds = [
  {
    id: 'bigsur',
    name: 'Big Sur',
    type: 'video',
    category: 'classic',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/ACC3981E-22F2-49C3-83B7-5E9B44170DB1.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/ACC3981E-22F2-49C3-83B7-5E9B44170DB1.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/ACC3981E-22F2-49C3-83B7-5E9B44170DB1.mp4#t=0.1'
  },
  {
    id: 'sequoia',
    name: 'Sequoia',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    dark: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'sonoma',
    name: 'Sonoma',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    dark: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'ventura',
    name: 'Ventura',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    dark: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'monterey',
    name: 'Monterey',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    dark: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
  },
  {
    id: 'horizon',
    name: 'Horizon',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    dark: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)'
  },
  {
    id: 'forest',
    name: 'Forest',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    dark: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
  },
  {
    id: 'nord',
    name: 'Nord',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #d8dee9 0%, #a3be8c 100%)',
    dark: 'linear-gradient(135deg, #2e3440 0%, #4c566a 100%)'
  },
  {
    id: 'slate',
    name: 'Slate',
    type: 'gradient',
    category: 'classic',
    live: false,
    light: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
    dark: 'linear-gradient(135deg, #485563 0%, #29323c 100%)'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    type: 'gradient',
    category: 'classic',
    live: true,
    light: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    dark: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'nebula',
    name: 'Nebula',
    type: 'gradient',
    category: 'classic',
    live: true,
    light: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    dark: 'linear-gradient(135deg, #bd34fe 0%, #47caff 100%)'
  },
  {
    id: 'tide',
    name: 'Tide',
    type: 'gradient',
    category: 'classic',
    live: true,
    light: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    dark: 'linear-gradient(135deg, #005c97 0%, #363795 100%)'
  },
  {
    id: 'ember',
    name: 'Ember',
    type: 'gradient',
    category: 'classic',
    live: true,
    light: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    dark: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'anime-lycoris',
    name: 'Lycoris Recoil',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/0b3468c4-4132-49cf-8b70-1df8d86c6de9.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/0b3468c4-4132-49cf-8b70-1df8d86c6de9.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/0b3468c4-4132-49cf-8b70-1df8d86c6de9.mp4#t=0.1'
  },
  {
    id: 'anime-sagiri',
    name: 'Sagiri Hells Paradise',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/bbc3d5a5-1f3a-4cc2-8b04-d6c23db83f87.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/bbc3d5a5-1f3a-4cc2-8b04-d6c23db83f87.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/bbc3d5a5-1f3a-4cc2-8b04-d6c23db83f87.mp4#t=0.1'
  },
  {
    id: 'anime-night-city',
    name: 'Night City',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/9ee1bbc4-50da-418c-8a00-3296b9f07a23.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/9ee1bbc4-50da-418c-8a00-3296b9f07a23.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/9ee1bbc4-50da-418c-8a00-3296b9f07a23.mp4#t=0.1'
  },
  {
    id: '6864b34d-99c7-4130-8eb3-43d24ab59f8d',
    name: 'Anime Girl Tank',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/6864b34d-99c7-4130-8eb3-43d24ab59f8d.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/6864b34d-99c7-4130-8eb3-43d24ab59f8d.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/6864b34d-99c7-4130-8eb3-43d24ab59f8d.mp4#t=0.1'
  },
  {
    id: '60f80bab-6f5e-4e8c-b8ec-9d0dd59027d3',
    name: 'Anime Girl',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/60f80bab-6f5e-4e8c-b8ec-9d0dd59027d3.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/60f80bab-6f5e-4e8c-b8ec-9d0dd59027d3.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/60f80bab-6f5e-4e8c-b8ec-9d0dd59027d3.mp4#t=0.1'
  },
  {
    id: '79145d59-7c10-476b-87a4-4ad089e1b60b',
    name: '4K HD Anime Girl',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/79145d59-7c10-476b-87a4-4ad089e1b60b.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/79145d59-7c10-476b-87a4-4ad089e1b60b.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/79145d59-7c10-476b-87a4-4ad089e1b60b.mp4#t=0.1'
  },
  {
    id: '87e0fbf7-8a1d-4345-a194-1152f34065b9',
    name: 'Anime Girl Eyes Rose Bloom',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/87e0fbf7-8a1d-4345-a194-1152f34065b9.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/87e0fbf7-8a1d-4345-a194-1152f34065b9.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/87e0fbf7-8a1d-4345-a194-1152f34065b9.mp4#t=0.1'
  },
  {
    id: '44ED4772-3DE7-4912-BFD9-91C0DFA01B6E',
    name: 'Neon Anime Girl',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/44ED4772-3DE7-4912-BFD9-91C0DFA01B6E.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/44ED4772-3DE7-4912-BFD9-91C0DFA01B6E.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/44ED4772-3DE7-4912-BFD9-91C0DFA01B6E.mp4#t=0.1'
  },
  {
    id: '9778C0C1-944D-43E0-B27B-253FEA3A2693',
    name: 'Kitsune Anime Girl Gamer',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/9778C0C1-944D-43E0-B27B-253FEA3A2693.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/9778C0C1-944D-43E0-B27B-253FEA3A2693.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/9778C0C1-944D-43E0-B27B-253FEA3A2693.mp4#t=0.1'
  },
  {
    id: '7d3bf072-f113-4c83-8f9b-6369c8058b0a',
    name: 'Calm Zenitsu',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/7d3bf072-f113-4c83-8f9b-6369c8058b0a.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/7d3bf072-f113-4c83-8f9b-6369c8058b0a.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/7d3bf072-f113-4c83-8f9b-6369c8058b0a.mp4#t=0.1'
  },
  {
    id: '3a4d0216-b78b-4685-b100-f60b8a5de2fb',
    name: 'Swimsuit',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/3a4d0216-b78b-4685-b100-f60b8a5de2fb.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/3a4d0216-b78b-4685-b100-f60b8a5de2fb.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/3a4d0216-b78b-4685-b100-f60b8a5de2fb.mp4#t=0.1'
  },
  {
    id: '9a9689d4-d16b-45b7-a7aa-e7243fb8c3fa',
    name: 'System Err3r',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/9a9689d4-d16b-45b7-a7aa-e7243fb8c3fa.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/9a9689d4-d16b-45b7-a7aa-e7243fb8c3fa.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/9a9689d4-d16b-45b7-a7aa-e7243fb8c3fa.mp4#t=0.1'
  },
  {
    id: 'a33bac0a-b629-43f2-90df-864b0aec6eac',
    name: 'Gabimaru the Hollow',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/a33bac0a-b629-43f2-90df-864b0aec6eac.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/a33bac0a-b629-43f2-90df-864b0aec6eac.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/a33bac0a-b629-43f2-90df-864b0aec6eac.mp4#t=0.1'
  },
  {
    id: '1d200f0f-cfb8-4450-be63-4f37afb59cdb',
    name: 'Gabimaru the Hollow 2',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/1d200f0f-cfb8-4450-be63-4f37afb59cdb.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/1d200f0f-cfb8-4450-be63-4f37afb59cdb.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/1d200f0f-cfb8-4450-be63-4f37afb59cdb.mp4#t=0.1'
  },
  {
    id: '85442b20-e80c-4e2c-8018-3ba68d2a84d9',
    name: 'Reze Silent Glow',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/85442b20-e80c-4e2c-8018-3ba68d2a84d9.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/85442b20-e80c-4e2c-8018-3ba68d2a84d9.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/85442b20-e80c-4e2c-8018-3ba68d2a84d9.mp4#t=0.1'
  },
  {
    id: '4cb68a84-ba76-4619-b234-21410acbed22',
    name: 'Silent Train Ride',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/4cb68a84-ba76-4619-b234-21410acbed22.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/4cb68a84-ba76-4619-b234-21410acbed22.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/4cb68a84-ba76-4619-b234-21410acbed22.mp4#t=0.1'
  },
  {
    id: '1262a862-d649-4778-9a09-5f7442369955',
    name: 'Lonely Train Ride',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/1262a862-d649-4778-9a09-5f7442369955.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/1262a862-d649-4778-9a09-5f7442369955.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/1262a862-d649-4778-9a09-5f7442369955.mp4#t=0.1'
  },
  {
    id: '3b1e80ca-103d-45bb-96dd-8c6d127d0db9',
    name: 'Stormy Night Ride',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/3b1e80ca-103d-45bb-96dd-8c6d127d0db9.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/3b1e80ca-103d-45bb-96dd-8c6d127d0db9.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/3b1e80ca-103d-45bb-96dd-8c6d127d0db9.mp4#t=0.1'
  },
  {
    id: '3ebda5f2-4bdc-41b6-9716-eece5772e2fb',
    name: 'Blissful Night at Train Station',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/3ebda5f2-4bdc-41b6-9716-eece5772e2fb.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/3ebda5f2-4bdc-41b6-9716-eece5772e2fb.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/3ebda5f2-4bdc-41b6-9716-eece5772e2fb.mp4#t=0.1'
  },
  {
    id: 'ebfaa1af-18c2-473b-9589-a364b47cb980',
    name: 'Soulbound Cherry Tree',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/ebfaa1af-18c2-473b-9589-a364b47cb980.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/ebfaa1af-18c2-473b-9589-a364b47cb980.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/ebfaa1af-18c2-473b-9589-a364b47cb980.mp4#t=0.1'
  },
  {
    id: 'ddf8effa-135a-4fca-a78e-4c34a1389a72',
    name: 'Hashiras',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/ddf8effa-135a-4fca-a78e-4c34a1389a72.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/ddf8effa-135a-4fca-a78e-4c34a1389a72.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/ddf8effa-135a-4fca-a78e-4c34a1389a72.mp4#t=0.1'
  },
  {
    id: '02fc55fe-e2e5-49d2-8117-d7e06b9841d2',
    name: 'Genshin Impact Yae Miko',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/02fc55fe-e2e5-49d2-8117-d7e06b9841d2.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/02fc55fe-e2e5-49d2-8117-d7e06b9841d2.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/02fc55fe-e2e5-49d2-8117-d7e06b9841d2.mp4#t=0.1'
  },
  {
    id: '62f10c20-6994-453f-9c91-1173ea29a348',
    name: 'Naruto Chibi',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/62f10c20-6994-453f-9c91-1173ea29a348.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/62f10c20-6994-453f-9c91-1173ea29a348.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/62f10c20-6994-453f-9c91-1173ea29a348.mp4#t=0.1'
  },
  {
    id: '854d2a74-121c-44fd-b666-2cbef32e48fc',
    name: 'Limitless Power Goku',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/854d2a74-121c-44fd-b666-2cbef32e48fc.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/854d2a74-121c-44fd-b666-2cbef32e48fc.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/854d2a74-121c-44fd-b666-2cbef32e48fc.mp4#t=0.1'
  },
  {
    id: 'b4464309-12b5-4022-aeff-679f56f37e6c',
    name: 'Sukuna Split Soul',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/b4464309-12b5-4022-aeff-679f56f37e6c.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/b4464309-12b5-4022-aeff-679f56f37e6c.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/b4464309-12b5-4022-aeff-679f56f37e6c.mp4#t=0.1'
  },
  {
    id: '712075f9-fb6a-4b95-bd6f-f33a101aaaa7',
    name: 'Sukuna Mahoraga',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/712075f9-fb6a-4b95-bd6f-f33a101aaaa7.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/712075f9-fb6a-4b95-bd6f-f33a101aaaa7.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/712075f9-fb6a-4b95-bd6f-f33a101aaaa7.mp4#t=0.1'
  },
  {
    id: '357afea4-46dd-48cf-8c67-865e31dd3798',
    name: 'Gojo vs Sukuna Domain Expansion',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/357afea4-46dd-48cf-8c67-865e31dd3798.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/357afea4-46dd-48cf-8c67-865e31dd3798.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/357afea4-46dd-48cf-8c67-865e31dd3798.mp4#t=0.1'
  },
  {
    id: '262E8EF4-B5F2-4878-A291-A67151E1CF20',
    name: 'Gojo Domain Expansion',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/262E8EF4-B5F2-4878-A291-A67151E1CF20.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/262E8EF4-B5F2-4878-A291-A67151E1CF20.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/262E8EF4-B5F2-4878-A291-A67151E1CF20.mp4#t=0.1'
  },
  {
    id: '549a9001-1c72-47ce-8f96-fff476fe5cc6',
    name: 'Satoru Gojo',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/549a9001-1c72-47ce-8f96-fff476fe5cc6.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/549a9001-1c72-47ce-8f96-fff476fe5cc6.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/549a9001-1c72-47ce-8f96-fff476fe5cc6.mp4#t=0.1'
  },
  {
    id: 'B88B132E-D708-44D9-B819-1EDD3A82B2B6',
    name: 'Satoru Gojo 2',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/B88B132E-D708-44D9-B819-1EDD3A82B2B6.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/B88B132E-D708-44D9-B819-1EDD3A82B2B6.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/B88B132E-D708-44D9-B819-1EDD3A82B2B6.mp4#t=0.1'
  },
  {
    id: '9c4c0729-118f-4da6-8205-743ab0766f28',
    name: 'Gojo Satoru',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/9c4c0729-118f-4da6-8205-743ab0766f28.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/9c4c0729-118f-4da6-8205-743ab0766f28.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/9c4c0729-118f-4da6-8205-743ab0766f28.mp4#t=0.1'
  },
  {
    id: 'B911E08F-CFF3-4DC7-B672-E659880EA54F',
    name: 'Gojo vs Sukuna',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/B911E08F-CFF3-4DC7-B672-E659880EA54F.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/B911E08F-CFF3-4DC7-B672-E659880EA54F.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/B911E08F-CFF3-4DC7-B672-E659880EA54F.mp4#t=0.1'
  },
  {
    id: 'C27C11E3-9BF7-444F-B569-176D75141278',
    name: 'Sukuna Yuji',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/C27C11E3-9BF7-444F-B569-176D75141278.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/C27C11E3-9BF7-444F-B569-176D75141278.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/C27C11E3-9BF7-444F-B569-176D75141278.mp4#t=0.1'
  },
  {
    id: 'EB3C2E94-FC6A-499C-A649-0DEAAEEA5CE4',
    name: 'Ryomen Sukuna',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/EB3C2E94-FC6A-499C-A649-0DEAAEEA5CE4.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/EB3C2E94-FC6A-499C-A649-0DEAAEEA5CE4.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/EB3C2E94-FC6A-499C-A649-0DEAAEEA5CE4.mp4#t=0.1'
  },
  {
    id: '526e2b68-26fd-44d1-8bef-e906237b32ec',
    name: 'Sukuna',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/526e2b68-26fd-44d1-8bef-e906237b32ec.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/526e2b68-26fd-44d1-8bef-e906237b32ec.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/526e2b68-26fd-44d1-8bef-e906237b32ec.mp4#t=0.1'
  },
  {
    id: '735cecbb-57f7-410a-9474-8d1a45ad15df',
    name: 'Itachi Straw Hat',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/735cecbb-57f7-410a-9474-8d1a45ad15df.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/735cecbb-57f7-410a-9474-8d1a45ad15df.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/735cecbb-57f7-410a-9474-8d1a45ad15df.mp4#t=0.1'
  },
  {
    id: '74257548-e1f9-4677-928f-2547c7643965',
    name: 'Yoimiya Genshin Impact',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/74257548-e1f9-4677-928f-2547c7643965.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/74257548-e1f9-4677-928f-2547c7643965.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/74257548-e1f9-4677-928f-2547c7643965.mp4#t=0.1'
  },
  {
    id: 'd8a43fa9-fe12-484b-a442-7a634bbd14a8',
    name: 'Toyota Girl Anime',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/d8a43fa9-fe12-484b-a442-7a634bbd14a8.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/d8a43fa9-fe12-484b-a442-7a634bbd14a8.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/d8a43fa9-fe12-484b-a442-7a634bbd14a8.mp4#t=0.1'
  },
  {
    id: '3e551170-6d15-43d5-981a-d5a57f47843d',
    name: 'Ace Pirate',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/3e551170-6d15-43d5-981a-d5a57f47843d.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/3e551170-6d15-43d5-981a-d5a57f47843d.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/3e551170-6d15-43d5-981a-d5a57f47843d.mp4#t=0.1'
  },
  {
    id: '4c39d64d-5f33-4989-963e-dde95c6c3879',
    name: 'King of Night',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/4c39d64d-5f33-4989-963e-dde95c6c3879.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/4c39d64d-5f33-4989-963e-dde95c6c3879.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/4c39d64d-5f33-4989-963e-dde95c6c3879.mp4#t=0.1'
  },
  {
    id: '93403936-15a7-4dac-9b5a-dd9c3f30856b',
    name: 'Doraemon Flying',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/93403936-15a7-4dac-9b5a-dd9c3f30856b.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/93403936-15a7-4dac-9b5a-dd9c3f30856b.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/93403936-15a7-4dac-9b5a-dd9c3f30856b.mp4#t=0.1'
  },
  {
    id: 'ecfdcf0f-763c-44c9-889c-a70e2e03da9f',
    name: 'The Quintessential Quintuplets',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/ecfdcf0f-763c-44c9-889c-a70e2e03da9f.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/ecfdcf0f-763c-44c9-889c-a70e2e03da9f.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/ecfdcf0f-763c-44c9-889c-a70e2e03da9f.mp4#t=0.1'
  },
  {
    id: '80493a7a-2901-4b63-bbe0-d404543c73aa',
    name: 'Quintuplets Wedding',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/80493a7a-2901-4b63-bbe0-d404543c73aa.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/80493a7a-2901-4b63-bbe0-d404543c73aa.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/80493a7a-2901-4b63-bbe0-d404543c73aa.mp4#t=0.1'
  },
  {
    id: '4dbdc027-a50a-40b1-8c2e-de0c8baf9bc9',
    name: 'Quintuplets Aura',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/4dbdc027-a50a-40b1-8c2e-de0c8baf9bc9.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/4dbdc027-a50a-40b1-8c2e-de0c8baf9bc9.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/4dbdc027-a50a-40b1-8c2e-de0c8baf9bc9.mp4#t=0.1'
  },
  {
    id: '44c8207b-23ef-4e66-bcc1-a38215815e08',
    name: '5-Toubun no Hanayome',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/44c8207b-23ef-4e66-bcc1-a38215815e08.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/44c8207b-23ef-4e66-bcc1-a38215815e08.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/44c8207b-23ef-4e66-bcc1-a38215815e08.mp4#t=0.1'
  },
  {
    id: 'c59a0d90-8139-4dab-a113-292287d47494',
    name: 'Sparxie',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/c59a0d90-8139-4dab-a113-292287d47494.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/c59a0d90-8139-4dab-a113-292287d47494.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/c59a0d90-8139-4dab-a113-292287d47494.mp4#t=0.1'
  },
  {
    id: '1a2d3d21-8084-4cb6-8a6b-87d6122d056e',
    name: 'Iuno Live Wallpaper',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/1a2d3d21-8084-4cb6-8a6b-87d6122d056e.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/1a2d3d21-8084-4cb6-8a6b-87d6122d056e.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/1a2d3d21-8084-4cb6-8a6b-87d6122d056e.mp4#t=0.1'
  },
  {
    id: '88f05d66-9319-4cdc-a7b8-3b02cad4ac31',
    name: 'Lofi Girl Medieval',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/88f05d66-9319-4cdc-a7b8-3b02cad4ac31.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/88f05d66-9319-4cdc-a7b8-3b02cad4ac31.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/88f05d66-9319-4cdc-a7b8-3b02cad4ac31.mp4#t=0.1'
  },
  {
    id: '72a5a09f-c0e4-46e7-a05c-e4afa3f00680',
    name: 'R3tro Girl',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/72a5a09f-c0e4-46e7-a05c-e4afa3f00680.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/72a5a09f-c0e4-46e7-a05c-e4afa3f00680.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/72a5a09f-c0e4-46e7-a05c-e4afa3f00680.mp4#t=0.1'
  },
  {
    id: 'df0e5f3b-b402-46a0-99ef-03eaad6d1493',
    name: 'Cute Pink Cat Girl',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/df0e5f3b-b402-46a0-99ef-03eaad6d1493.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/df0e5f3b-b402-46a0-99ef-03eaad6d1493.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/df0e5f3b-b402-46a0-99ef-03eaad6d1493.mp4#t=0.1'
  },
  {
    id: '98058d11-2437-4707-abd7-867928fbb086',
    name: 'Cute Chibi Girl',
    type: 'video',
    category: 'anime',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/98058d11-2437-4707-abd7-867928fbb086.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/98058d11-2437-4707-abd7-867928fbb086.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/98058d11-2437-4707-abd7-867928fbb086.mp4#t=0.1'
  },
  {
    id: '32673cb7-b6e3-4ef7-b503-179386df08a7',
    name: 'Chroma Spider',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/32673cb7-b6e3-4ef7-b503-179386df08a7.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/32673cb7-b6e3-4ef7-b503-179386df08a7.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/32673cb7-b6e3-4ef7-b503-179386df08a7.mp4#t=0.1'
  },
  {
    id: '8ce0c988-0e18-4f90-90b8-7cf55a42e588',
    name: 'Minimalist',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/8ce0c988-0e18-4f90-90b8-7cf55a42e588.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/8ce0c988-0e18-4f90-90b8-7cf55a42e588.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/8ce0c988-0e18-4f90-90b8-7cf55a42e588.mp4#t=0.1'
  },
  {
    id: '22dd1e1a-a49a-46bd-b50a-941f4b053544',
    name: 'Spider-Man Miles Morales',
    type: 'video',
    category: 'movies',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/22dd1e1a-a49a-46bd-b50a-941f4b053544.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/22dd1e1a-a49a-46bd-b50a-941f4b053544.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/22dd1e1a-a49a-46bd-b50a-941f4b053544.mp4#t=0.1'
  },
  {
    id: '0e0d9427-b739-4325-bc0c-03acec16ec3e',
    name: 'Spider-Man / Miles Morales',
    type: 'video',
    category: 'movies',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/0e0d9427-b739-4325-bc0c-03acec16ec3e.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/0e0d9427-b739-4325-bc0c-03acec16ec3e.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/0e0d9427-b739-4325-bc0c-03acec16ec3e.mp4#t=0.1'
  },
  {
    id: '934462ad-eb37-4cce-98cf-4f55554b612a',
    name: 'Venom Devours Spider-Man',
    type: 'video',
    category: 'movies',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/934462ad-eb37-4cce-98cf-4f55554b612a.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/934462ad-eb37-4cce-98cf-4f55554b612a.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/934462ad-eb37-4cce-98cf-4f55554b612a.mp4#t=0.1'
  },
  {
    id: '9372e7c0-c134-4d4d-82be-95684c78da96',
    name: 'Spider-Man',
    type: 'video',
    category: 'movies',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/9372e7c0-c134-4d4d-82be-95684c78da96.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/9372e7c0-c134-4d4d-82be-95684c78da96.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/9372e7c0-c134-4d4d-82be-95684c78da96.mp4#t=0.1'
  },
  {
    id: '5fcd04d7-968a-4c29-99bf-d46ea3a0b787',
    name: 'Spider-Man',
    type: 'video',
    category: 'movies',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/5fcd04d7-968a-4c29-99bf-d46ea3a0b787.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/5fcd04d7-968a-4c29-99bf-d46ea3a0b787.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/5fcd04d7-968a-4c29-99bf-d46ea3a0b787.mp4#t=0.1'
  },
  {
    id: '7ac94741-f348-4ba8-a303-1c815122dc85',
    name: 'Spider-Man Brand New Day',
    type: 'video',
    category: 'movies',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/7ac94741-f348-4ba8-a303-1c815122dc85.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/7ac94741-f348-4ba8-a303-1c815122dc85.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/7ac94741-f348-4ba8-a303-1c815122dc85.mp4#t=0.1'
  },
  {
    id: 'cae77500-45c3-4b56-9690-98e0f5da3554',
    name: '4K Silver Surfer',
    type: 'video',
    category: 'movies',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/cae77500-45c3-4b56-9690-98e0f5da3554.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/cae77500-45c3-4b56-9690-98e0f5da3554.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/cae77500-45c3-4b56-9690-98e0f5da3554.mp4#t=0.1'
  },
  {
    id: 'f567b30c-977a-4b46-a3f6-cd15eee3d906',
    name: '911 GT3 RS NATYRE DRIVE',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/f567b30c-977a-4b46-a3f6-cd15eee3d906.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/f567b30c-977a-4b46-a3f6-cd15eee3d906.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/f567b30c-977a-4b46-a3f6-cd15eee3d906.mp4#t=0.1'
  },
  {
    id: '2C6FCA9D-9E5D-49A5-A8DD-CAAD148C4BAF',
    name: 'Sunset Drive by Car',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/2C6FCA9D-9E5D-49A5-A8DD-CAAD148C4BAF.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/2C6FCA9D-9E5D-49A5-A8DD-CAAD148C4BAF.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/2C6FCA9D-9E5D-49A5-A8DD-CAAD148C4BAF.mp4#t=0.1'
  },
  {
    id: 'a403bab4-94fd-4193-a9c9-754d047efac2',
    name: 'Red Bull',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/a403bab4-94fd-4193-a9c9-754d047efac2.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/a403bab4-94fd-4193-a9c9-754d047efac2.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/a403bab4-94fd-4193-a9c9-754d047efac2.mp4#t=0.1'
  },
  {
    id: 'f454eef3-0f14-43c0-82e2-09e7542ccaf8',
    name: 'Agera RS',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/f454eef3-0f14-43c0-82e2-09e7542ccaf8.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/f454eef3-0f14-43c0-82e2-09e7542ccaf8.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/f454eef3-0f14-43c0-82e2-09e7542ccaf8.mp4#t=0.1'
  },
  {
    id: '445beb86-415b-4a65-b50c-a8ec94c65d71',
    name: 'BMW M3 GTR NFS 4k Chill Wallpaper',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/445beb86-415b-4a65-b50c-a8ec94c65d71.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/445beb86-415b-4a65-b50c-a8ec94c65d71.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/445beb86-415b-4a65-b50c-a8ec94c65d71.mp4#t=0.1'
  },
  {
    id: '1A3FE9EB-594B-4662-B934-4796665876AB',
    name: 'McLaren 765LT Spider Blossom Street',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/1A3FE9EB-594B-4662-B934-4796665876AB.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/1A3FE9EB-594B-4662-B934-4796665876AB.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/1A3FE9EB-594B-4662-B934-4796665876AB.mp4#t=0.1'
  },
  {
    id: '16e92cb0-c361-409a-ad9e-95bce766b09e',
    name: 'F1 McLaren',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/16e92cb0-c361-409a-ad9e-95bce766b09e.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/16e92cb0-c361-409a-ad9e-95bce766b09e.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/16e92cb0-c361-409a-ad9e-95bce766b09e.mp4#t=0.1'
  },
  {
    id: '28267ebf-cb51-43ee-8390-84bc247a9863',
    name: 'BMW',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/28267ebf-cb51-43ee-8390-84bc247a9863.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/28267ebf-cb51-43ee-8390-84bc247a9863.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/28267ebf-cb51-43ee-8390-84bc247a9863.mp4#t=0.1'
  },
  {
    id: 'D9CBD69E-89A8-42B4-BD2C-BB5E35888832',
    name: 'Introducing McLaren P1',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/D9CBD69E-89A8-42B4-BD2C-BB5E35888832.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/D9CBD69E-89A8-42B4-BD2C-BB5E35888832.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/D9CBD69E-89A8-42B4-BD2C-BB5E35888832.mp4#t=0.1'
  },
  {
    id: '9AC11E07-B65A-48AB-9731-8B87E15BFA15',
    name: 'McLaren F1',
    type: 'video',
    category: 'car',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/9AC11E07-B65A-48AB-9731-8B87E15BFA15.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/9AC11E07-B65A-48AB-9731-8B87E15BFA15.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/9AC11E07-B65A-48AB-9731-8B87E15BFA15.mp4#t=0.1'
  },
  {
    id: '66a0a7ec-a76a-41fa-a65b-b420eb6ba7d2',
    name: 'Cat under rain',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/66a0a7ec-a76a-41fa-a65b-b420eb6ba7d2.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/66a0a7ec-a76a-41fa-a65b-b420eb6ba7d2.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/66a0a7ec-a76a-41fa-a65b-b420eb6ba7d2.mp4#t=0.1'
  },
  {
    id: '63A15048-C7AB-41D9-AD33-42878BC99880',
    name: 'nknkn',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/63A15048-C7AB-41D9-AD33-42878BC99880.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/63A15048-C7AB-41D9-AD33-42878BC99880.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/63A15048-C7AB-41D9-AD33-42878BC99880.mp4#t=0.1'
  },
  {
    id: '712aacd5-5ace-471f-adfb-ed5c78a1b9d7',
    name: 'Stray cat Cyberpunk',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/712aacd5-5ace-471f-adfb-ed5c78a1b9d7.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/712aacd5-5ace-471f-adfb-ed5c78a1b9d7.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/712aacd5-5ace-471f-adfb-ed5c78a1b9d7.mp4#t=0.1'
  },
  {
    id: '7d0e5472-bdcc-45c2-a06a-739be051c6bc',
    name: 'ReinDeer',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/7d0e5472-bdcc-45c2-a06a-739be051c6bc.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/7d0e5472-bdcc-45c2-a06a-739be051c6bc.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/7d0e5472-bdcc-45c2-a06a-739be051c6bc.mp4#t=0.1'
  },
  {
    id: 'b686bb36-6250-4945-acd2-44641eafbeca',
    name: 'Twin Cats Watching Night City',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/b686bb36-6250-4945-acd2-44641eafbeca.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/b686bb36-6250-4945-acd2-44641eafbeca.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/b686bb36-6250-4945-acd2-44641eafbeca.mp4#t=0.1'
  },
  {
    id: '88d87661-64d4-4435-8eb5-f4efebfc0500',
    name: 'Cats on a fence',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/88d87661-64d4-4435-8eb5-f4efebfc0500.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/88d87661-64d4-4435-8eb5-f4efebfc0500.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/88d87661-64d4-4435-8eb5-f4efebfc0500.mp4#t=0.1'
  },
  {
    id: 'ce9b4137-47a6-4a61-ac11-e073e8f37b0c',
    name: 'Cat and Starry Night',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/ce9b4137-47a6-4a61-ac11-e073e8f37b0c.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/ce9b4137-47a6-4a61-ac11-e073e8f37b0c.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/ce9b4137-47a6-4a61-ac11-e073e8f37b0c.mp4#t=0.1'
  },
  {
    id: 'ca434232-a2fc-471f-8fcf-dca34aa6df21',
    name: 'Cat and Starry Night',
    type: 'video',
    category: 'animals',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/ca434232-a2fc-471f-8fcf-dca34aa6df21.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/ca434232-a2fc-471f-8fcf-dca34aa6df21.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/ca434232-a2fc-471f-8fcf-dca34aa6df21.mp4#t=0.1'
  },
  {
    id: 'ee577707-1944-4ba1-b3ae-63819e7595a0',
    name: 'Faded Memories',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/ee577707-1944-4ba1-b3ae-63819e7595a0.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/ee577707-1944-4ba1-b3ae-63819e7595a0.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/ee577707-1944-4ba1-b3ae-63819e7595a0.mp4#t=0.1'
  },
  {
    id: '12105424-4314-4e1e-a068-304fb6fb4b22',
    name: 'Architectural Minimalism',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/12105424-4314-4e1e-a068-304fb6fb4b22.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/12105424-4314-4e1e-a068-304fb6fb4b22.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/12105424-4314-4e1e-a068-304fb6fb4b22.mp4#t=0.1'
  },
  {
    id: '7cf841d9-5736-4507-be4f-d27f506882a6',
    name: 'MRI 7 Tesla 8K',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/7cf841d9-5736-4507-be4f-d27f506882a6.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/7cf841d9-5736-4507-be4f-d27f506882a6.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/7cf841d9-5736-4507-be4f-d27f506882a6.mp4#t=0.1'
  },
  {
    id: '73805a02-304b-41df-9531-88ef46910c26',
    name: 'Static Knight',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/73805a02-304b-41df-9531-88ef46910c26.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/73805a02-304b-41df-9531-88ef46910c26.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/73805a02-304b-41df-9531-88ef46910c26.mp4#t=0.1'
  },
  {
    id: '8f536767-e0fd-494c-9984-96ec803842dd',
    name: 'Kali Linux Glitch',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/8f536767-e0fd-494c-9984-96ec803842dd.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/8f536767-e0fd-494c-9984-96ec803842dd.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/8f536767-e0fd-494c-9984-96ec803842dd.mp4#t=0.1'
  },
  {
    id: '84eb2c85-aa3f-496b-b6f0-97d671dadb77',
    name: 'Anime Girl Behind Curtains',
    type: 'video',
    category: 'minimalist',
    live: true,
    light: 'https://cdn.wallper.app/wallper-user-generated/84eb2c85-aa3f-496b-b6f0-97d671dadb77.mp4',
    dark: 'https://cdn.wallper.app/wallper-user-generated/84eb2c85-aa3f-496b-b6f0-97d671dadb77.mp4',
    thumbnail: 'https://cdn.wallper.app/wallper-user-generated/84eb2c85-aa3f-496b-b6f0-97d671dadb77.mp4#t=0.1'
  }
]

export const BackgroundProvider = ({ children }) => {
  const { resolvedTheme } = useTheme()
  // Rollout default: King of Night applies once for every user who hasn't
  // explicitly chosen a wallpaper after this deploy (guarded by the
  // "customized" flag set in changeBackground).
  const DEFAULT_BG_ID = '4c39d64d-5f33-4989-963e-dde95c6c3879' // King of Night
  const defaultBg = backgrounds.find(bg => bg.id === DEFAULT_BG_ID) || backgrounds[0]
  const [currentBg, setCurrentBg] = useState(defaultBg)
  const [customBg, setCustomBg] = useState(null)

  // Derive the theme-aware background value
  const currentBgWithTheme = {
    ...currentBg,
    value: currentBg[resolvedTheme] || currentBg.dark
  }

  useEffect(() => {
    // Restore the saved background after mount. Reading localStorage
    // here (rather than via a lazy initializer) avoids SSR/hydration
    // mismatches for users with a saved custom background.
    const restoreSavedBackground = () => {
      try {
        const custom = localStorage.getItem('notesAppCustomBackground')
        if (custom) {
          setCustomBg(custom)
          return
        }

        const customized = localStorage.getItem('notesAppBackgroundCustomized')
        const saved = localStorage.getItem('notesAppBackground')

        if (!customized) {
          // First run after the King of Night rollout (or user never chose
          // one): force the new default once, then persist it so it sticks.
          setCurrentBg(defaultBg)
          try {
            localStorage.setItem('notesAppBackground', defaultBg.id)
            localStorage.setItem('notesAppBackgroundCustomized', '1')
          } catch { /* ignore */ }
          return
        }

        // User has customized after rollout → honor their stored choice.
        const found = saved ? backgrounds.find(bg => bg.id === saved) : undefined
        if (found) setCurrentBg(found)
      } catch {
        // ignore storage access errors
      }
    }

    const rafId = requestAnimationFrame(restoreSavedBackground)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const changeBackground = (bgId) => {
    const found = backgrounds.find(bg => bg.id === bgId)
    if (found) {
      setCurrentBg(found)
      try {
        // User explicitly chose this wallpaper → respect it from now on.
        localStorage.setItem('notesAppBackgroundCustomized', '1')
      } catch { /* ignore */ }
      // clearing any custom background when user selects a built-in
      setCustomBg(prev => {
        try {
          if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
            URL.revokeObjectURL(prev)
          }
        } catch { /* ignore */ }
        return null
      })
      try { localStorage.removeItem('notesAppCustomBackground') } catch { /* ignore */ }
      localStorage.setItem('notesAppBackground', bgId)
    }
  }

  const setCustomBackground = (url) => {
    // Revoke previous blob URL when replacing it to avoid memory leaks
    setCustomBg(prev => {
      try {
        if (prev && typeof prev === 'string' && prev.startsWith('blob:') && prev !== url) {
          URL.revokeObjectURL(prev)
        }
      } catch {
        // ignore
      }
      return url
    })

    // Persist only non-blob URLs (data URLs). Blob URLs cannot be stored and are session-scoped.
    if (typeof url === 'string' && !url.startsWith('blob:')) {
      try {
        localStorage.setItem('notesAppCustomBackground', url)
        localStorage.setItem('notesAppBackgroundCustomized', '1')
      } catch (err) {
        // localStorage may fail on some browsers for large images; ignore
        console.warn('Failed to persist custom background', err)
      }
    } else {
      try { localStorage.removeItem('notesAppCustomBackground') } catch { /* ignore */ }
    }

    // clear chosen built-in background when using custom
    localStorage.removeItem('notesAppBackground')
  }

  const removeCustomBackground = () => {
    // If custom background is a blob URL, revoke it before clearing
    setCustomBg(prev => {
      try {
        if (prev && typeof prev === 'string' && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev)
        }
      } catch {
        // ignore
      }
      return null
    })
    try { localStorage.removeItem('notesAppCustomBackground') } catch { /* ignore */ }
    // restore selected built-in if present, otherwise fallback to default
    const saved = localStorage.getItem('notesAppBackground')
    if (saved) {
      const found = backgrounds.find(bg => bg.id === saved)
      if (found) setCurrentBg(found)
      else setCurrentBg(backgrounds[0])
    } else {
      setCurrentBg(backgrounds[0])
    }
  }

  return (
    <BackgroundContext.Provider value={{
      currentBg: currentBgWithTheme,
      customBg,
      backgrounds,
      changeBackground,
      setCustomBackground,
      removeCustomBackground
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export const useBackground = () => useContext(BackgroundContext)

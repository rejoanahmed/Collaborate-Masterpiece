'use client'
import React, { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { UserAtom, shareModalAtom, spaceAtom } from '@/state'
import { Avatar, Button, Label, Modal, TextInput } from 'flowbite-react'
import { Share } from 'lucide-react'
import {
  UserDoc,
  getAllUsers,
  shareWorkspace
} from '@/services/firebase/firestore'

function ShareModal() {
  const [openModal, setOpenModal] = useAtom(shareModalAtom)
  const space = useAtomValue(spaceAtom)
  console.log(space)
  const user = useAtomValue(UserAtom)
  const [users, setUsers] = useState<UserDoc[]>([])
  const [email, setEmail] = useState('')
  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users || [])
    })
  }, [])
  if (!space || !user || user === 'loading') return null
  return (
    <>
      <Button
        onClick={() => setOpenModal('dismissible')}
        className='bg-slate-400 hover:bg-slate-500 mr-2'
      >
        <Share size={18} />
      </Button>
      <Modal
        dismissible
        size={'sm'}
        show={openModal === 'dismissible'}
        onClose={() => setOpenModal(undefined)}
      >
        <Modal.Header>Share with others</Modal.Header>
        <Modal.Body className='relative pt-0'>
          <form className='max-w-md flex-col sticky top-0 bg-white py-2'>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='email1' value='Email' />
              </div>
              <TextInput
                id='email1'
                placeholder='name@flowbite.com'
                required
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>
          <div className='flex flex-col gap-2'>
            {users
              .filter((u) => u.id !== user.uid)
              .map((user) => (
                <div className='flex gap-2' key={user.id}>
                  <div className='flex flex-grow items-center gap-2 px-4 py-2 rounded-md bg-slate-500 text-slate-200'>
                    <Avatar img={user.photoURL} size='sm' rounded />
                    <p>{user.name}</p>
                  </div>
                  <Button
                    onClick={() => shareWorkspace(space, user.id)}
                    className='bg-slate-400 hover:bg-slate-500 mr-2'
                  >
                    <Share size={18} />
                  </Button>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(undefined)}>I accept</Button>
          <Button color='gray' onClick={() => setOpenModal(undefined)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ShareModal

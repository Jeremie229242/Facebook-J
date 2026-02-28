import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createOrUpdateUserBio } from '@/service/user.service'
import { Save } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const EditBio = ({isOpen,onClose,initialData,id,fetchProfile}) => {
  const {register,handleSubmit,reset,formState:{isSubmitting}} = useForm({
    defaultValues:initialData,
  })
  const handleEditBio = async(data) =>{
        try {
           await createOrUpdateUserBio(id,data)
           toast.success('Biographie de l\'utilisateur mise à jour avec succès')
           await fetchProfile()
           onClose();
        } catch (error) {
           console.log('erreur lors de la création ou de la mise à jour du profil utilisateur', error)
        }
  }
  return (
     <Dialog open={isOpen} onOpenChange={onClose}>
     <DialogContent className = "sm:max-w-[425px]">
           <DialogHeader>
            Modifier Bio
           </DialogHeader>
           <form onSubmit={handleSubmit(handleEditBio)}>
             <div className='grid gap-4 py-4'>
               <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="bio" className="text-right">Bio</Label>
                <Textarea
                 id='bioText'
                 className="col-span-3"
                 {...register("bioText")}
                />
               </div>

               <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="liveIn" className="text-right">Vivre dans</Label>
                <Input
                 id='liveIn'
                 className="col-span-3"
                 {...register("liveIn")}
                />
               </div>
               <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="relationship" className="text-right">Relation</Label>
                <Input
                 id='relationship'
                 {...register("relationship")}
                 className="col-span-3"
                
                />
               </div>

               <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="workPlace" className="text-right">Lieu de travail</Label>
                <Input
                 id='workplace'
                 {...register("workplace")}
                 className="col-span-3"
                
                />
               </div>

               <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="education" className="text-right">Education</Label>
                <Input
                 id='education'
                 {...register("education")}
                 className="col-span-3"
                
                />
               </div>


               <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="phone" className="text-right">TelePhone</Label>
                <Input
                 id='phone'
                 {...register("phone")}
                 className="col-span-3"
                
                />
               </div>


               <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor="hometown" className="text-right">Ville natale</Label>
                <Input
                 id='hometown'
                 {...register("hometown")}
                 className="col-span-3"
                
                />
               </div>
             </div>
             <DialogFooter>
             <Button type="submit" disabled={isSubmitting} >
              <Save className="w-4 h-4 mr-2"/>  {isSubmitting ? "Patienter..." : "sauvegarder"}
                </Button>
             </DialogFooter>
           </form>
     </DialogContent>
     </Dialog>
  )
}

export default EditBio

-- Add foreign key constraint for team_members.user_id -> profiles.id
ALTER TABLE public.team_members 
ADD CONSTRAINT team_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint for teams.created_by -> profiles.id  
ALTER TABLE public.teams 
ADD CONSTRAINT teams_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

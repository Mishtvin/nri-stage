'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  Mail, 
  UserPlus, 
  Download, 
  Upload, 
  Filter,
  Save
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { userStore } from '@/lib/data-store';
import { User } from '@/components/shared/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'player' as 'player' | 'master' | 'admin',
    status: 'active' as 'active' | 'inactive' | 'banned',
    level: 1,
    password: ''
  });

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = userStore.onChange((newUsers) => {
      setUsers(newUsers);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    let filtered = users;
    
    if (currentTab === 'players') {
      filtered = filtered.filter(user => user.role === 'player');
    } else if (currentTab === 'masters') {
      filtered = filtered.filter(user => user.role === 'master');
    } else if (currentTab === 'admins') {
      filtered = filtered.filter(user => user.role === 'admin');
    }
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus, currentTab]);

  const handleAddUser = () => {
    setFormData({
      name: '', email: '', role: 'player', status: 'active', level: 1, password: ''
    });
    setIsAddUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      level: user.level || 1,
      password: ''
    });
    setIsEditUserDialogOpen(true);
  };

  const handleSaveUser = async (isEdit: boolean) => {
    if (isEdit && userToEdit) {
      await userStore.update(userToEdit.id, {
        name: formData.name, email: formData.email, role: formData.role,
        status: formData.status, level: formData.level
      });
      setIsEditUserDialogOpen(false);
      toast.success("Пользователь обновлен");
    } else {
      await userStore.add({
        name: formData.name, email: formData.email, role: formData.role,
        status: formData.status, level: formData.level, campaigns: 0,
        characters: 0, lastActive: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      });
      setIsAddUserDialogOpen(false);
      toast.success("Пользователь добавлен");
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      await userStore.delete(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      toast.success("Пользователь удален");
    }
  };

  const handleChangeRole = async (user: User) => {
    const roles: ('player' | 'master' | 'admin')[] = ['player', 'master', 'admin'];
    const currentIndex = roles.indexOf(user.role);
    const nextIndex = (currentIndex + 1) % roles.length;
    const newRole = roles[nextIndex];
    await userStore.update(user.id, { role: newRole });
    toast.success("Роль изменена");
  };
  
  // Omitted for brevity: handleExportUsers, handleImportUsers, handleSendEmail, getStatusColor, getRoleColor

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление пользователями</h1>
          <p className="text-muted-foreground">
            Просмотр и управление всеми пользователями системы
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAddUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Добавить пользователя
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Пользователи</CardTitle>
          <CardDescription>
            Всего пользователей: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* ... UI for filters and tabs ... */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Уровень</TableHead>
                  <TableHead>Дата регистрации</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8"><Users className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" /></TableCell></TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">Пользователи не найдены</TableCell></TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{user.level}</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>Редактировать</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(user)}>Изменить роль</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-destructive">Удалить</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs for add/edit/delete */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        {/* ... Dialog content for adding a user ... */}
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Отмена</Button>
            <Button type="submit" onClick={() => handleSaveUser(false)}>Создать</Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        {/* ... Dialog content for editing a user ... */}
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>Отмена</Button>
            <Button type="submit" onClick={() => handleSaveUser(true)}>Сохранить</Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Удалить пользователя?</DialogTitle></DialogHeader>
            <DialogDescription>Вы уверены, что хотите удалить {userToDelete?.name}?</DialogDescription>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
                <Button variant="destructive" onClick={confirmDeleteUser}>Удалить</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
